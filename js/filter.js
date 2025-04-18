// Track selected filters
console.log('Filter page script loaded');

let selectedCategory = null;
let selectedSubcategory = null;
let selectedSize = 'All';
let selectedColor = 'All';
let currentOpenDropdown = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const sizeDropdown = document.getElementById('sizeDropdown');
    sizeDropdown.innerHTML = `
        <span onclick="selectSize('All')">All</span>
        <span onclick="selectSize('XS')">XS</span>
        <span onclick="selectSize('S')">S</span>
        <span onclick="selectSize('M')">M</span>
        <span onclick="selectSize('L')">L</span>
        <span onclick="selectSize('XL')">XL</span>
    `;

    loadProductsFromStorage();
    setupProductClickHandlers();
    applyFilters();
});

// Load products from localStorage
function loadProductsFromStorage() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    try {
        const products = JSON.parse(localStorage.getItem('products')) || [];

        if (products.length === 0) {
            productGrid.innerHTML = '<div class="no-products">No products found. Add products first.</div>';
            return;
        }

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.setAttribute('data-category', product.category || '');
            productDiv.setAttribute('data-subcategory', product.type || '');
            // Store all sizes and colors as JSON strings
            productDiv.setAttribute('data-sizes', JSON.stringify(product.sizes || []));
            productDiv.setAttribute('data-colors', JSON.stringify(product.colors || []));

            productDiv.innerHTML = `
                <div class="box">
                    ${product.image ? 
                        `<img src="${product.image}" class="product-box">` : 
                        '<div class="no-image">No Image</div>'
                    }
                </div>
                <div class="product-name">${product.name || 'Unnamed Product'}</div>
            `;

            productGrid.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Load error:', error);
        productGrid.innerHTML = '<div class="no-products">Error loading products</div>';
    }
}

// Toggle category selection
function toggleCategory(element) {
    if (selectedCategory === element.textContent) {
        element.classList.remove('active');
        selectedCategory = null;
    } else {
        document.querySelectorAll('.category-row span').forEach(span => {
            span.classList.remove('active');
        });
        element.classList.add('active');
        selectedCategory = element.textContent;
    }
    applyFilters();
}

// Toggle subcategory selection
function toggleSubcategory(element) {
    if (selectedSubcategory === element.textContent) {
        element.classList.remove('active');
        selectedSubcategory = null;
    } else {
        document.querySelectorAll('.subcategory-row span').forEach(span => {
            span.classList.remove('active');
        });
        element.classList.add('active');
        selectedSubcategory = element.textContent;
    }
    applyFilters();
}

// Toggle size dropdown
function toggleSizeDropdown() {
    const dropdown = document.getElementById('sizeDropdown');
    toggleDropdown(dropdown, 'sizeFilter');
}

// Toggle color dropdown
function toggleColorDropdown() {
    const dropdown = document.getElementById('colorDropdown');
    toggleDropdown(dropdown, 'colorFilter');
}

// Generic dropdown toggle function
function toggleDropdown(dropdown, filterId) {
    if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
        currentOpenDropdown.style.display = 'none';
    }

    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
        currentOpenDropdown = null;
    } else {
        dropdown.style.display = 'block';
        currentOpenDropdown = dropdown;
    }
}

// Size mapping object
const sizeNames = {
    'All': 'All',
    'XS': 'Extra Small',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'XL': 'Extra Large'
};

// Select size filter
function selectSize(size) {
    selectedSize = size;
    const displayName = sizeNames[size];
    document.getElementById('sizeFilter').querySelector('.selected-option').textContent = displayName;
    document.getElementById('sizeDropdown').style.display = 'none';
    currentOpenDropdown = null;

    document.querySelectorAll('#sizeDropdown span').forEach(span => {
        span.classList.remove('selected');
        if (span.textContent === size) {
            span.classList.add('selected');
        }
    });

    applyFilters();
}

// Select color filter
function selectColor(color) {
    selectedColor = color;
    document.getElementById('colorFilter').querySelector('.selected-option').textContent = color;
    document.getElementById('colorDropdown').style.display = 'none';
    currentOpenDropdown = null;

    document.querySelectorAll('#colorDropdown span').forEach(span => {
        span.classList.remove('selected');
        if (span.textContent === color) {
            span.classList.add('selected');
        }
    });

    applyFilters();
}

// Apply all active filters
function applyFilters() {
    const products = document.querySelectorAll('.product-grid > div');
    let anyVisible = false;

    products.forEach(product => {
        const category = product.getAttribute('data-category');
        const subcategory = product.getAttribute('data-subcategory');
        const sizes = JSON.parse(product.getAttribute('data-sizes') || '[]');
        const colors = JSON.parse(product.getAttribute('data-colors') || '[]');

        let shouldShow = true;

        // Category filter
        if (selectedCategory && category !== selectedCategory) {
            shouldShow = false;
        }

        // Subcategory filter
        if (selectedSubcategory && subcategory !== selectedSubcategory) {
            shouldShow = false;
        }

        // Size filter (check if any size matches)
        if (selectedSize !== 'All' && !sizes.includes(selectedSize)) {
            shouldShow = false;
        }

        // Color filter (case-insensitive check)
        if (selectedColor !== 'All' && !colors.some(c => c && c.toLowerCase() === selectedColor.toLowerCase())) {
            shouldShow = false;
        }

        if (shouldShow) {
            product.style.display = 'block';
            anyVisible = true;
        } else {
            product.style.display = 'none';
        }
    });

    const noProductsMsg = document.querySelector('.no-products');
    if (!anyVisible) {
        if (!noProductsMsg) {
            const msg = document.createElement('div');
            msg.className = 'no-products';
            msg.textContent = 'No products match your filters';
            document.querySelector('.product-grid').appendChild(msg);
        }
    } else if (noProductsMsg) {
        noProductsMsg.remove();
    }
}

// Setup click handlers for all products
function setupProductClickHandlers() {
    document.querySelectorAll('.product-grid > div').forEach(product => {
        product.addEventListener('click', function() {
            const productName = this.querySelector('.product-name').textContent;

            const products = JSON.parse(localStorage.getItem('products')) || [];
            const clickedProduct = products.find(p => p.name === productName);

            if (clickedProduct) {
                localStorage.setItem('currentProduct', JSON.stringify(clickedProduct));
            } else {
                const tempProduct = {
                    name: productName,
                    category: this.getAttribute('data-category'),
                    type: this.getAttribute('data-subcategory'),
                    sizes: JSON.parse(this.getAttribute('data-sizes') || '[]'),
                    colors: JSON.parse(this.getAttribute('data-colors') || '[]'),
                    image: this.querySelector('img')?.src || ''
                };
                localStorage.setItem('currentProduct', JSON.stringify(tempProduct));
            }

            window.location.href = 'item details.html';
        });
    });
}

// Close dropdowns when clicking elsewhere
document.addEventListener('click', function(e) {
    if (currentOpenDropdown && !e.target.closest('.dropdown') && !e.target.closest('.filter-row span')) {
        currentOpenDropdown.style.display = 'none';
        currentOpenDropdown = null;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromStorage();
    setupProductClickHandlers();
    applyFilters();
});
