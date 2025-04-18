// DOM Elements
const productDetailsBox = document.getElementById('productDetailsBox');
const contentCareBox = document.getElementById('contentCareBox');
const sizeFitBox = document.getElementById('sizeFitBox');

// Store form data temporarily
let formData = {};

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    const uploadText = document.getElementById('uploadText');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadText.style.display = 'none';
            document.getElementById('uploadContainer').classList.remove('upload-required');
            hideError('fileInput');
        }
        reader.readAsDataURL(file);
    }
}

function toggleSize(element) {
    element.classList.toggle('selected');
    const hasSelection = document.querySelectorAll('.size-option.selected').length > 0;

    if (hasSelection) {
        hideError('size');
    }
}

function clearPlaceholder(element) {
    if (element.innerText.trim() === 'Enter product details here...' ||
        element.innerText.trim() === 'Enter content and care instructions here...' ||
        element.innerText.trim() === 'Enter size and fit information here...') {
        element.innerText = '';
        element.classList.remove('placeholder');
    }
}

function restorePlaceholder(element, text) {
    if (element.innerText.trim() === '') {
        element.innerText = text;
        element.classList.add('placeholder');
    }
}

function toggleColor(element) {
    element.classList.toggle('selected');
    const hasSelection = document.querySelectorAll('.color-option.selected').length > 0;

    if (hasSelection) {
        hideError('color');
    }
}

function selectCategory(element) {
    const categoryOptions = element.parentElement.querySelectorAll('.category-option');
    categoryOptions.forEach(option => {
        option.classList.remove('selected');
    });

    element.classList.add('selected');
    hideError('category');
}

function selectType(element) {
    const typeOptions = element.parentElement.querySelectorAll('.type-option');
    typeOptions.forEach(option => {
        option.classList.remove('selected');
    });

    element.classList.add('selected');
    hideError('type');
}

function submitForm() {
    // First validate all required fields
    if (!validateForm()) {
        return false; // Stop if validation fails
    }

    // Gather all form data
    const rawProductName = document.getElementById('productName').value;
    formData.productName = capitalizeWords(rawProductName);
    formData.productQuantity = document.getElementById('productQuantity').value;
    formData.imageInput = document.getElementById('fileInput');
    formData.selectedCategory = document.querySelector('.category-option.selected')?.innerText || '';
    formData.selectedType = document.querySelector('.type-option.selected')?.innerText || '';

    // Get selected sizes
    formData.selectedSizes = [];
    document.querySelectorAll('.size-option.selected').forEach(size => {
        formData.selectedSizes.push(size.innerText);
    });

    // Get selected colors
    formData.selectedColors = [];
    document.querySelectorAll('.color-option.selected').forEach(color => {
        formData.selectedColors.push(color.innerText);
    });

    // Get details content
    formData.productDetails = getCleanContent(productDetailsBox);
    formData.contentCare = getCleanContent(contentCareBox);
    formData.sizeFit = getCleanContent(sizeFitBox);

    // Show confirmation popup only if validation passed
    document.getElementById('confirmationPopup').style.display = 'flex';
    return false;
}

function getCleanContent(element) {
    const text = element.innerText.trim();
    return text.startsWith('Enter ') ? '' : text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

console.log("Form data before submission:", formData);

async function confirmSubmission() {
    try {
        // Create product data object
        const productData = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5), // Unique ID
            name: formData.productName,
            category: formData.selectedCategory,
            type: formData.selectedType,
            sizes: formData.selectedSizes,
            colors: formData.selectedColors,
            image: await getImageData(formData.imageInput.files[0]),
            quantity: parseInt(formData.productQuantity),
            details: formData.productDetails,
            contentCare: formData.contentCare,
            sizeFit: formData.sizeFit,
            dateAdded: new Date().toISOString(),
            isNew: true  // Add this flag to mark as a new item
        };

        // Handle image upload
        if (formData.imageInput.files && formData.imageInput.files[0]) {
            productData.image = await getImageData(formData.imageInput.files[0]);
    
            // Compress image if too large
            if (productData.image.length > 1000000) { // 1MB
                productData.image = await compressImage(productData.image);
            }
        }

        // Save product to localStorage
        const success = await saveProduct(productData);

        if (success) {
            // Store the complete product object to display in item details
            localStorage.setItem('currentProduct', JSON.stringify(productData));
            window.location.href = 'item details.html';
        } else {
            alert('Failed to save product. Please try again.');
            document.getElementById('confirmationPopup').style.display = 'none';
        }
    } catch (error) {
        console.error('Detailed error:', error);
        alert(`Error: ${error.message}`);
        document.getElementById('confirmationPopup').style.display = 'none';
    }
}

function validateProductData(product) {
    const requiredFields = ['id', 'name', 'category', 'type', 'sizes', 'colors'];
    const missingFields = requiredFields.filter(field => !product[field]);

    if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return false;
    }

    if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
        console.error('Invalid sizes array');
        return false;
    }

    if (!Array.isArray(product.colors) || product.colors.length === 0) {
        console.error('Invalid colors array');
        return false;
    }

    return true;
}

// Usage in saveProduct():
if (!validateProductData(productData)) {
    throw new Error('Invalid product data');
}

function migrateOldProducts() {
    const oldProducts = JSON.parse(localStorage.getItem('old_products')) || [];
    const newProducts = oldProducts.map(product => ({
        id: product.id || Date.now().toString(36),
        name: product.name || 'Unnamed Product',
        category: product.category || 'UNCATEGORIZED',
        type: product.type || 'UNSPECIFIED',
        sizes: product.sizes || [],
        colors: product.colors || [],
        image: product.image || null,
        // Preserve other existing data
        ...product
    }));

    localStorage.setItem('products', JSON.stringify(newProducts));
}

function cancelSubmission() {
    document.getElementById('confirmationPopup').style.display = 'none';
}

function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function validateForm() {
    let isValid = true;

    // Validate image upload
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files || fileInput.files.length === 0) {
        document.getElementById('uploadContainer').classList.add('upload-required');
        showError('fileInput');
        isValid = false;
    } else {
        document.getElementById('uploadContainer').classList.remove('upload-required');
        hideError('fileInput');
    }

    // Validate product name
    const productName = document.getElementById('productName').value.trim();
    if (!productName) {
        document.getElementById('productName').classList.add('input-error');
        showError('productName');
        isValid = false;
    } else {
        document.getElementById('productName').classList.remove('input-error');
        hideError('productName');
    }

    // Validate quantity
    const quantity = document.getElementById('productQuantity').value.trim();
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
        document.getElementById('productQuantity').classList.add('input-error');
        showError('productQuantity');
        isValid = false;
    } else {
        document.getElementById('productQuantity').classList.remove('input-error');
        hideError('productQuantity');
    }

    // Validate sizes
    const sizesSelected = document.querySelectorAll('.size-option.selected').length > 0;
    if (!sizesSelected) {
        document.querySelector('.size-selection').classList.add('selection-required');
        showError('size');
        isValid = false;
    } else {
        document.querySelector('.size-selection').classList.remove('selection-required');
        hideError('size');
    }

    // Validate colors
    const colorsSelected = document.querySelectorAll('.color-option.selected').length > 0;
    if (!colorsSelected) {
        document.querySelector('.color-selection').classList.add('selection-required');
        showError('color');
        isValid = false;
    } else {
        document.querySelector('.color-selection').classList.remove('selection-required');
        hideError('color');
    }

    // Validate category
    const categorySelected = document.querySelector('.category-option.selected') !== null;
    if (!categorySelected) {
        document.querySelector('.category-selection').classList.add('selection-required');
        showError('category');
        isValid = false;
    } else {
        document.querySelector('.category-selection').classList.remove('selection-required');
        hideError('category');
    }

    // Validate type
    const typeSelected = document.querySelector('.type-option.selected') !== null;
    if (!typeSelected) {
        document.querySelector('.type-selection').classList.add('selection-required');
        showError('type');
        isValid = false;
    } else {
        document.querySelector('.type-selection').classList.remove('selection-required');
        hideError('type');
    }

    // Validate product details box
    if (productDetailsBox.innerText.trim() === '' || 
        productDetailsBox.innerText.trim() === 'Enter product details here...') {
        productDetailsBox.classList.add('details-required');
        showError('details');
        isValid = false;
    } else {
        productDetailsBox.classList.remove('details-required');
        hideError('details');
    }

    // Validate content and care box
    if (contentCareBox.innerText.trim() === '' || 
        contentCareBox.innerText.trim() === 'Enter content and care instructions here...') {
        contentCareBox.classList.add('details-required');
        showError('contentCare');
        isValid = false;
    } else {
        contentCareBox.classList.remove('details-required');
        hideError('contentCare');
    }

    // Validate size and fit box
    if (sizeFitBox.innerText.trim() === '' || 
        sizeFitBox.innerText.trim() === 'Enter size and fit information here...') {
        sizeFitBox.classList.add('details-required');
        showError('sizeFit');
        isValid = false;
    } else {
        sizeFitBox.classList.remove('details-required');
        hideError('sizeFit');
    }

    if (!isValid) {
        scrollToFirstError();
    }

    return isValid;
}

function showError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function scrollToFirstError() {
    const firstError = document.querySelector('.input-error, .upload-required, .selection-required, .details-required');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Improved product storage
async function saveProduct(productData) {
    try {
        let products = JSON.parse(localStorage.getItem('products')) || [];

        // Ensure product has required filter fields
        productData = {
            ...productData,
            sizes: productData.sizes || [],
            colors: productData.colors || [],
            category: productData.category || 'UNCATEGORIZED',
            type: productData.type || 'UNSPECIFIED'
        };

        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));

        console.log('Successfully saved:', productData); // Debug
        return true;
    } catch (error) {
        console.error('Save error:', error);
        return false;
    }
}

// Basic image compression
async function compressImage(dataUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions (reduce by 50%)
            const width = img.width * 0.5;
            const height = img.height * 0.5;

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG with 70% quality
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = dataUrl;
    });
}

// Helper function to get image data
function getImageData(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// Event listeners for real-time validation
document.getElementById('fileInput').addEventListener('change', function() {
    if (this.files && this.files.length > 0) {
        document.getElementById('uploadContainer').classList.remove('upload-required');
        hideError('fileInput');
    }
});

document.getElementById('productName').addEventListener('input', function() {
    if (this.value.trim()) {
        this.classList.remove('input-error');
        hideError('productName');
    }
});

document.getElementById('productQuantity').addEventListener('input', function() {
    if (this.value.trim() && !isNaN(this.value)) {
        this.classList.remove('input-error');
        hideError('productQuantity');
    }
});

// For content-editable boxes
[productDetailsBox, contentCareBox, sizeFitBox].forEach(box => {
    box.addEventListener('input', function() {
        if (this.innerText.trim() && !this.innerText.trim().startsWith('Enter ')) {
            this.classList.remove('details-required');
            const boxId = this.id.replace('Box', '');
            hideError(boxId);
        }
    });
});

// Prevent form submission on Enter key in inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitForm();
        }
    });
});



console.log('Saved products:', JSON.parse(localStorage.getItem('products')));