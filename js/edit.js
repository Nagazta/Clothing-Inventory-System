 // Store product data
 let currentProductId = null;
 let originalProductData = null;
 let hasChanges = false;
 let originalFormData = {};

 // Initialize page with product data
 document.addEventListener('DOMContentLoaded', function() {
     const productData = JSON.parse(localStorage.getItem('currentProduct'));
     if (!productData || !productData.id) {
         alert("No product selected. Redirecting...");
         window.location.href = 'Filters Page.html';
         return;
     }
     
     currentProductId = productData.id;
     originalProductData = productData;
     
     // Store original form data for change detection
     originalFormData = {
         name: productData.name || '',
         quantity: productData.quantity || '0',
         sizes: productData.sizes || [],
         colors: productData.colors || [],
         category: productData.category || '',
         type: productData.type || '',
         details: productData.details || '',
         contentCare: productData.contentCare || '',
         sizeFit: productData.sizeFit || '',
         image: productData.image || ''
     };

     // Populate form fields
     document.getElementById('productName').value = originalFormData.name;
     document.getElementById('productQuantity').value = originalFormData.quantity;

     // Set image if exists
     if (originalFormData.image) {
         const preview = document.getElementById('preview');
         preview.src = originalFormData.image;
         preview.style.display = 'block';
         document.getElementById('uploadText').style.display = 'none';
     }

     // Select sizes
     originalFormData.sizes.forEach(size => {
         document.querySelectorAll('.size-option').forEach(option => {
             if (option.textContent === size) {
                 option.classList.add('selected');
             }
         });
     });

     // Select colors
     originalFormData.colors.forEach(color => {
         document.querySelectorAll('.color-option').forEach(option => {
             if (option.textContent === color) {
                 option.classList.add('selected');
             }
         });
     });

     // Select category
     document.querySelectorAll('.category-option').forEach(option => {
         if (option.textContent === originalFormData.category) {
             option.classList.add('selected');
         }
     });

     // Select type
     document.querySelectorAll('.type-option').forEach(option => {
         if (option.textContent === originalFormData.type) {
             option.classList.add('selected');
         }
     });

     // Set details content
     const productDetailsBox = document.getElementById('productDetailsBox');
     if (originalFormData.details) {
         productDetailsBox.innerText = originalFormData.details;
         productDetailsBox.classList.remove('placeholder');
     }

     const contentCareBox = document.getElementById('contentCareBox');
     if (originalFormData.contentCare) {
         contentCareBox.innerText = originalFormData.contentCare;
         contentCareBox.classList.remove('placeholder');
     }

     const sizeFitBox = document.getElementById('sizeFitBox');
     if (originalFormData.sizeFit) {
         sizeFitBox.innerText = originalFormData.sizeFit;
         sizeFitBox.classList.remove('placeholder');
     }

     // Add change listeners
     addChangeListeners();
 });

 function addChangeListeners() {
     document.getElementById('productName').addEventListener('input', () => hasChanges = true);
     document.getElementById('productQuantity').addEventListener('input', () => hasChanges = true);
     document.getElementById('fileInput').addEventListener('change', () => hasChanges = true);
     
     document.querySelectorAll('.size-option, .color-option, .category-option, .type-option').forEach(el => {
         el.addEventListener('click', () => hasChanges = true);
     });
     
     document.getElementById('productDetailsBox').addEventListener('input', () => hasChanges = true);
     document.getElementById('contentCareBox').addEventListener('input', () => hasChanges = true);
     document.getElementById('sizeFitBox').addEventListener('input', () => hasChanges = true);
 }

 // Form submission
 function submitForm() {
     if (!validateForm()) {
         return false;
     }

     document.getElementById('confirmationPopup').style.display = 'flex';
     return false;
 }

 async function confirmSubmission() {
     try {
         const updatedProduct = {
             id: currentProductId,
             name: document.getElementById('productName').value,
             category: document.querySelector('.category-option.selected').textContent,
             type: document.querySelector('.type-option.selected').textContent,
             quantity: parseInt(document.getElementById('productQuantity').value),
             sizes: getSelectedValues('.size-option.selected'),
             colors: getSelectedValues('.color-option.selected'),
             details: getCleanContent(document.getElementById('productDetailsBox')),
             contentCare: getCleanContent(document.getElementById('contentCareBox')),
             sizeFit: getCleanContent(document.getElementById('sizeFitBox')),
             dateAdded: originalProductData.dateAdded,
             image: originalProductData.image
         };

         // Handle image update if changed
         const fileInput = document.getElementById('fileInput');
         if (fileInput.files && fileInput.files[0]) {
             updatedProduct.image = await getImageData(fileInput.files[0]);
         }

         // Update product in storage
         const success = updateProductInStorage(updatedProduct);
         
         if (success) {
             localStorage.setItem('currentProduct', JSON.stringify(updatedProduct));
             window.location.href = 'item details.html';
         } else {
             alert("Failed to update product.");
         }
     } catch (error) {
         console.error("Update error:", error);
         alert("An error occurred while updating.");
     }
 }

 function cancelSubmission() {
     document.getElementById('confirmationPopup').style.display = 'none';
 }

 // Delete functionality
 function showDeleteConfirmation() {
     document.getElementById('deleteConfirmationPopup').style.display = 'flex';
 }

 function cancelDelete() {
     document.getElementById('deleteConfirmationPopup').style.display = 'none';
 }

 function confirmDelete() {
     const products = JSON.parse(localStorage.getItem('products')) || [];
     const updatedProducts = products.filter(p => p.id !== currentProductId);
     
     localStorage.setItem('products', JSON.stringify(updatedProducts));
     window.location.href = 'Filters Page.html';
 }

 // Back button functionality
 function checkForChanges() {
     if (hasChanges) {
         document.getElementById('backConfirmationPopup').style.display = 'flex';
     } else {
         window.location.href = 'item details.html';
     }
 }

 function discardChanges() {
     window.location.href = 'item details.html';
 }

 function saveAndGoBack() {
     document.getElementById('backConfirmationPopup').style.display = 'none';
     submitForm();
 }

 // Helper functions
 function getSelectedValues(selector) {
     return Array.from(document.querySelectorAll(selector)).map(el => el.textContent);
 }

 function getCleanContent(element) {
     const text = element.innerText.trim();
     return text.startsWith('Enter ') ? '' : text;
 }

 function updateProductInStorage(updatedProduct) {
     try {
         const products = JSON.parse(localStorage.getItem('products')) || [];
         const index = products.findIndex(p => p.id === updatedProduct.id);
         
         if (index !== -1) {
             products[index] = updatedProduct;
             localStorage.setItem('products', JSON.stringify(products));
             return true;
         }
         return false;
     } catch (error) {
         console.error("Update error:", error);
         return false;
     }
 }

 async function getImageData(file) {
     return new Promise((resolve) => {
         const reader = new FileReader();
         reader.onload = (e) => resolve(e.target.result);
         reader.readAsDataURL(file);
     });
 }

 function validateForm() {
     let isValid = true;

     // Validate product name
     if (!document.getElementById('productName').value.trim()) {
         document.getElementById('productName').classList.add('input-error');
         showError('productName');
         isValid = false;
     } else {
         document.getElementById('productName').classList.remove('input-error');
         hideError('productName');
     }

     // Validate quantity
     const quantity = document.getElementById('productQuantity').value;
     if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
         document.getElementById('productQuantity').classList.add('input-error');
         showError('productQuantity');
         isValid = false;
     } else {
         document.getElementById('productQuantity').classList.remove('input-error');
         hideError('productQuantity');
     }

     // Validate sizes
     if (document.querySelectorAll('.size-option.selected').length === 0) {
         document.querySelector('.size-selection').classList.add('selection-required');
         showError('size');
         isValid = false;
     } else {
         document.querySelector('.size-selection').classList.remove('selection-required');
         hideError('size');
     }

     // Validate colors
     if (document.querySelectorAll('.color-option.selected').length === 0) {
         document.querySelector('.color-selection').classList.add('selection-required');
         showError('color');
         isValid = false;
     } else {
         document.querySelector('.color-selection').classList.remove('selection-required');
         hideError('color');
     }

     // Validate category
     if (!document.querySelector('.category-option.selected')) {
         document.querySelector('.category-selection').classList.add('selection-required');
         showError('category');
         isValid = false;
     } else {
         document.querySelector('.category-selection').classList.remove('selection-required');
         hideError('category');
     }

     // Validate type
     if (!document.querySelector('.type-option.selected')) {
         document.querySelector('.type-selection').classList.add('selection-required');
         showError('type');
         isValid = false;
     } else {
         document.querySelector('.type-selection').classList.remove('selection-required');
         hideError('type');
     }

     // Validate details
     const detailsBox = document.getElementById('productDetailsBox');
     if (detailsBox.innerText.trim() === '' || detailsBox.innerText.trim() === 'Enter product details here...') {
         detailsBox.classList.add('details-required');
         showError('details');
         isValid = false;
     } else {
         detailsBox.classList.remove('details-required');
         hideError('details');
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

 function toggleSize(element) {
     element.classList.toggle('selected');
     hideError('size');
 }

 function toggleColor(element) {
     element.classList.toggle('selected');
     hideError('color');
 }

 function selectCategory(element) {
     document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
     element.classList.add('selected');
     hideError('category');
 }

 function selectType(element) {
     document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
     element.classList.add('selected');
     hideError('type');
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

 function previewImage(event) {
     const file = event.target.files[0];
     const preview = document.getElementById('preview');
     const uploadText = document.getElementById('uploadText');

     if (file) {
         const reader = new FileReader();
         reader.onload = function(e) {
             preview.src = e.target.result;
             preview.style.display = 'block';
             uploadText.style.display = 'none';
             document.getElementById('uploadContainer').classList.remove('upload-required');
             hideError('fileInput');
         };
         reader.readAsDataURL(file);
     }
 }