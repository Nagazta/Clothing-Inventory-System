const products = [
    { 
        name: 'Classic White Shirt', 
        categories: ['MEN', 'TOPWEAR'], 
        size: 'M', 
        color: 'Red', 
        quantity: 10,
        contentAndCare: '100% Cotton. Machine wash cold.',
        sizeAndFit: 'Slim fit. Model is 6\'1" wearing size M.',
        imageUrl: 'assets/clothes-images/clothe1.png' 
    },
    { 
        name: 'Blue Denim Jeans', 
        categories: ['WOMEN', 'BOTTOMWEAR'], 
        size: 'S', 
        color: 'Blue', 
        quantity: 5,
        contentAndCare: '98% Cotton, 2% Spandex. Machine wash cold.',
        sizeAndFit: 'Regular fit. Model is 5\'8" wearing size S.',
        imageUrl: 'assets/clothes-images/clothe2.png' 
    },
    { 
        name: 'Kids Rain Jacket', 
        categories: ['BOYS', 'OUTERWEAR'], 
        size: 'L', 
        color: 'Yellow', 
        quantity: 8,
        contentAndCare: '100% Polyester. Machine wash cold.',
        sizeAndFit: 'Regular fit. Model is 5\'3" wearing size L.',
        imageUrl: 'assets/clothes-images/clothe3.png' 
    },
    { 
        name: 'Floral Summer Dress', 
        categories: ['GIRLS', 'DRESSES'], 
        size: 'XS', 
        color: 'Green', 
        quantity: 12,
        contentAndCare: '80% Cotton, 20% Polyester. Hand wash recommended.',
        sizeAndFit: 'A-line fit. Model is 4\'11" wearing size XS.',
        imageUrl: 'assets/clothes-images/clothe4.png' 
    },
    { 
        name: 'Black Graphic Tee', 
        categories: ['MEN', 'TOPWEAR'], 
        size: 'M', 
        color: 'Black', 
        quantity: 15,
        contentAndCare: '100% Cotton. Machine wash cold.',
        sizeAndFit: 'Regular fit. Model is 6\'0" wearing size M.',
        imageUrl: 'assets/clothes-images/clothe5.png' 
    },
    { 
        name: 'Elegant White Skirt', 
        categories: ['WOMEN', 'BOTTOMWEAR'], 
        size: 'XL', 
        color: 'White', 
        quantity: 7,
        contentAndCare: '90% Polyester, 10% Spandex. Machine wash cold.',
        sizeAndFit: 'High-waisted. Model is 5\'7" wearing size XL.',
        imageUrl: 'assets/clothes-images/Luminoire1.jpg' 
    }
];


let selectedCategories = [];
let selectedSize = null;
let selectedColor = null;

// Store the selected filters in localStorage
function storeFilters() {
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
    localStorage.setItem('selectedSize', selectedSize);
    localStorage.setItem('selectedColor', selectedColor);
}

// Highlight selected categories
function highlight(element) {
    element.classList.toggle('active');
    const category = element.textContent.trim();
    if (selectedCategories.includes(category)) {
        selectedCategories = selectedCategories.filter(item => item !== category);
    } else {
        selectedCategories.push(category);
    }
}

// Toggle dropdown for size
function toggleSizeDropdown() {
    document.getElementById('colorDropdown').style.display = 'none'; // Close color
    const dropdown = document.getElementById('sizeDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Toggle dropdown for color
function toggleColorDropdown() {
    document.getElementById('sizeDropdown').style.display = 'none'; // Close size
    const dropdown = document.getElementById('colorDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Select size filter
function selectSize(size) {
    selectedSize = size;
    document.getElementById('sizeFilter').innerHTML = `Size: ${size} ▼`;
}

// Select color filter
function selectColor(color) {
    selectedColor = color;
    document.getElementById('colorFilter').innerHTML = `Color: ${color} ▼`;
}

// Update product grid based on selected filters (when Apply Filters is clicked)
function updateProductGrid() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; // Clear the grid

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
        
       // Add click event to each product card to navigate to the item details page
    productCard.addEventListener('click', () => {
        // Store the clicked product in localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(product));

        // Navigate to item-details page with query parameters
        const url = `itemDetails.html?name=${encodeURIComponent(product.name)}&image=${encodeURIComponent(product.imageUrl)}&size=${encodeURIComponent(product.size)}&color=${encodeURIComponent(product.color)}&quantity=${encodeURIComponent(product.quantity)}&contentAndCare=${encodeURIComponent(product.contentAndCare)}&sizeAndFit=${encodeURIComponent(product.sizeAndFit)}`;
        window.location.href = url;
    });


        grid.appendChild(productCard);
    });
}

// Apply selected filters when the user clicks the "Apply Filters" button
function applyFilters() {
    updateProductGrid();
    
    // Store the selected filters
    storeFilters();

    // Close both dropdowns after applying filters
    document.getElementById('sizeDropdown').style.display = 'none';
    document.getElementById('colorDropdown').style.display = 'none';
}

// Initial load of all products
updateProductGrid();
