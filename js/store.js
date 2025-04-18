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
        quantity: 9,
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
        quantity: 11,
        contentAndCare: '90% Polyester, 10% Spandex. Machine wash cold.',
        sizeAndFit: 'High-waisted. Model is 5\'7" wearing size XL.',
        imageUrl: 'assets/clothes-images/Luminoire1.jpg'
    },
    {
        name: 'Elegant Black Skirt',
        categories: ['WOMEN', 'BOTTOMWEAR'],
        size: 'XL',
        color: 'White',
        quantity: 11,
        contentAndCare: '90% Polyester, 10% Spandex. Machine wash cold.',
        sizeAndFit: 'High-waisted. Model is 5\'7" wearing size XL.',
        imageUrl: 'assets/clothes-images/Luminoire1.jpg'
    }
   
];

// Save to localStorage
localStorage.setItem('products', JSON.stringify(products));
