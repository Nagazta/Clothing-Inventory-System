let currentProductId = null;

// On page load
document.addEventListener('DOMContentLoaded', function () {
    let productData = {};
    try {
        const storedProduct = localStorage.getItem('currentProduct');
        if (storedProduct) {
            productData = JSON.parse(storedProduct);
        }
    } catch (e) {
        console.error('Error parsing product data:', e);
    }

    if (!productData || !productData.id) {
        alert('No product data found. Please select a product first.');
        window.location.href = 'Filters Page.html';
        return;
    }

    currentProductId = productData.id;

    // Display product data
    document.getElementById('productNameDisplay').textContent =
        productData.name || 'No product selected';

    if (productData.category || productData.type) {
        document.getElementById('categoryTypeDisplay').innerHTML = `
            <span class="category">${productData.category || 'No category'}</span>
            <span class="separator">/</span>
            <span class="type">${productData.type || 'No type'}</span>
        `;
    }

    document.getElementById('productQuantityDisplay').textContent =
        productData.quantity || '0';

    const sizeOptionsElement = document.getElementById('sizeOptionsDisplay');
    if (productData.sizes && Array.isArray(productData.sizes)) {
        sizeOptionsElement.innerHTML = productData.sizes.map(size =>
            `<div class="size-box selected">${size}</div>`
        ).join('');
    } else {
        sizeOptionsElement.innerHTML = '<div class="no-sizes">No sizes selected</div>';
    }

    const colorOptionsElement = document.getElementById('colorOptionsDisplay');
    if (productData.colors && Array.isArray(productData.colors)) {
        colorOptionsElement.innerHTML = productData.colors.map(color =>
            `<div class="color-box" data-color="${color}">${color}</div>`
        ).join('');
    } else {
        colorOptionsElement.innerHTML = '<div class="no-colors">No colors selected</div>';
    }

    const imgElement = document.getElementById('productImageDisplay');
    if (productData.image && typeof productData.image === 'string' && productData.image.trim() !== '') {
        imgElement.src = productData.image;
        imgElement.style.display = 'block';
    } else {
        const container = document.querySelector('.product-image-container');
        container.textContent = 'No image available';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.color = '#777';
        container.style.fontStyle = 'italic';
    }

    const isPlaceholder = (text, phrases) => {
        if (!text || typeof text !== 'string') return true;
        return phrases.some(phrase => text.includes(phrase));
    };

    const productDetails = document.getElementById('productDetailsDisplay');
    if (isPlaceholder(productData.details, ['Enter product details here', 'No details provided'])) {
        productDetails.textContent = 'No details provided';
        productDetails.style.fontStyle = 'italic';
        productDetails.style.color = '#777';
    } else {
        productDetails.textContent = productData.details;
    }

    const contentCare = document.getElementById('contentCareDisplay');
    if (isPlaceholder(productData.contentCare, ['Enter content and care', 'No content and care instructions provided'])) {
        contentCare.textContent = 'No content and care instructions provided';
        contentCare.style.fontStyle = 'italic';
        contentCare.style.color = '#777';
    } else {
        contentCare.textContent = productData.contentCare;
    }

    const sizeFit = document.getElementById('sizeFitDisplay');
    if (isPlaceholder(productData.sizeFit, ['Enter size and fit', 'No size and fit information provided'])) {
        sizeFit.textContent = 'No size and fit information provided';
        sizeFit.style.fontStyle = 'italic';
        sizeFit.style.color = '#777';
    } else {
        sizeFit.textContent = productData.sizeFit;
    }
});

// Edit product
function editProduct() {
    window.location.href = 'edit item page.html';
}


