let selectedCategories = [];
let selectedSize = null;
let selectedColor = null;

function storeFilters() {
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    localStorage.setItem('selectedSize', selectedSize);
    localStorage.setItem('selectedColor', selectedColor);
}

function highlight(element) {
    element.classList.toggle('active');
    const category = element.textContent.trim();
    if (selectedCategories.includes(category)) {
        selectedCategories = selectedCategories.filter(item => item !== category);
    } else {
        selectedCategories.push(category);
    }
}

function toggleSizeDropdown() {
    document.getElementById('colorDropdown').style.display = 'none'; 
    const dropdown = document.getElementById('sizeDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function toggleColorDropdown() {
    document.getElementById('sizeDropdown').style.display = 'none'; 
    const dropdown = document.getElementById('colorDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function selectSize(size) {
    selectedSize = size;
    document.getElementById('sizeFilter').innerHTML = `Size: ${size} ▼`;
}

function selectColor(color) {
    selectedColor = color;
    document.getElementById('colorFilter').innerHTML = `Color: ${color} ▼`;
}

function updateProductGrid() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; 

    const products = JSON.parse(localStorage.getItem('products')) || [];

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(category => product.categories.includes(category));
        const sizeMatch = !selectedSize || product.size === selectedSize;
        const colorMatch = !selectedColor || product.color === selectedColor;
        return categoryMatch && sizeMatch && colorMatch;
    });

    if (filteredProducts.length === 0) {
        const notFoundContainer = document.createElement('div');
        notFoundContainer.classList.add('no-results-container');
    
        const notFoundMsg = document.createElement('div');
        notFoundMsg.classList.add('no-results');
        notFoundMsg.textContent = 'Cannot find item';
    
        notFoundContainer.appendChild(notFoundMsg);
        grid.appendChild(notFoundContainer);
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div class="box">
                <img src="${product.imageUrl}" alt="${product.name}" class="product-box">
            </div>
            <div class="product-name">${product.name}</div>
        `;
        
        productCard.addEventListener('click', () => {
            localStorage.setItem('selectedProductIndex', filteredProducts.indexOf(product));

            window.location.href = 'itemDetails.html'; 
        });

        grid.appendChild(productCard);
    });
}

function applyFilters() {
    updateProductGrid();
    
    storeFilters();

    document.getElementById('sizeDropdown').style.display = 'none';
    document.getElementById('colorDropdown').style.display = 'none';
}

updateProductGrid();
