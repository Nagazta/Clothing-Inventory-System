// Retrieve the selected product from localStorage
const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

// If a product is selected, populate the page with its details
if (selectedProduct) {
    document.querySelector('.product-name').textContent = selectedProduct.name;
    document.querySelector('.image-container img').src = selectedProduct.imageUrl;

    // Handle color
    document.getElementById('selected-color').textContent = selectedProduct.color;

    // Handle size
    document.getElementById('selected-size').textContent = selectedProduct.size;
}

// Retrieve selected filters from localStorage
const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories')) || [];
const selectedSize = localStorage.getItem('selectedSize');
const selectedColor = localStorage.getItem('selectedColor');

// Optionally, display or apply the filters (for example, show the selected color and size on the page)
console.log('Selected Categories:', selectedCategories);
console.log('Selected Size:', selectedSize);
console.log('Selected Color:', selectedColor);

// Color selection handler
function selectColor(color) {
    document.getElementById('selected-color').textContent = color;
    localStorage.setItem('selectedColor', color); // Store selected color
}

// Size selection handler
function selectSize(size) {
    document.getElementById('selected-size').textContent = size;
    localStorage.setItem('selectedSize', size); // Store selected size
}
