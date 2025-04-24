let selectedCategory = null;
let selectedSubcategory = null;
let selectedSize = 'All';
let selectedColor = 'All';
let currentOpenDropdown = null;

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

function toggleCategory(element) {
    const currentText = element.textContent;
    
    if (selectedCategory === currentText) {
        element.classList.remove('active');
        selectedCategory = null;
    } else {
        document.querySelectorAll('.category-row span').forEach(span => {
            span.classList.remove('active');
        });
        element.classList.add('active');
        selectedCategory = currentText;
    }
    applyFilters();
}

function toggleSubcategory(element) {
    const currentText = element.textContent;
    
    if (selectedSubcategory === currentText) {
        element.classList.remove('active');
        selectedSubcategory = null;
    } else {
        document.querySelectorAll('.subcategory-row span').forEach(span => {
            span.classList.remove('active');
        });
        element.classList.add('active');
        selectedSubcategory = currentText;
    }
    applyFilters();
}

function toggleSizeDropdown() {
    const dropdown = document.getElementById('sizeDropdown');
    toggleDropdown(dropdown, 'sizeFilter');
}

function toggleColorDropdown() {
    const dropdown = document.getElementById('colorDropdown');
    toggleDropdown(dropdown, 'colorFilter');
}

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

const sizeNames = {
    'All': 'All',
    'XS': 'Extra Small',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'XL': 'Extra Large'
};

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

function applyFilters() {
    const products = document.querySelectorAll('.product-grid > div');
    let anyVisible = false;

    products.forEach(product => {
        const category = product.getAttribute('data-category');
        const subcategory = product.getAttribute('data-subcategory');
        const sizes = JSON.parse(product.getAttribute('data-sizes') || '[]');
        const colors = JSON.parse(product.getAttribute('data-colors') || '[]');

        let shouldShow = true;

        if (selectedCategory && category !== selectedCategory) {
            shouldShow = false;
        }

        if (selectedSubcategory && subcategory !== selectedSubcategory) {
            shouldShow = false;
        }

        if (selectedSize !== 'All' && !sizes.includes(selectedSize)) {
            shouldShow = false;
        }

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

window.addEventListener('beforeunload', function() {
    const filterState = {
        category: selectedCategory,
        subcategory: selectedSubcategory,
        size: selectedSize,
        color: selectedColor
    };
    sessionStorage.setItem('filterState', JSON.stringify(filterState));
});

document.addEventListener('DOMContentLoaded', function() {
    const savedState = sessionStorage.getItem('filterState');
    if (savedState) {
        const filterState = JSON.parse(savedState);
            
        selectedCategory = filterState.category;
        selectedSubcategory = filterState.subcategory;
        selectedSize = filterState.size;
        selectedColor = filterState.color;

        if (selectedCategory) {
            document.querySelectorAll('.category-row span').forEach(span => {
                if (span.textContent === selectedCategory) {
                    span.classList.add('active');
                }
            });
        }

        if (selectedSubcategory) {
            document.querySelectorAll('.subcategory-row span').forEach(span => {
                if (span.textContent === selectedSubcategory) {
                    span.classList.add('active');
                }
            });
        }

        if (selectedSize) {
            document.getElementById('sizeFilter').querySelector('.selected-option').textContent = 
                sizeNames[selectedSize] || selectedSize;
        }

        if (selectedColor) {
            document.getElementById('colorFilter').querySelector('.selected-option').textContent = 
                selectedColor;
        }

        applyFilters();
    }
});