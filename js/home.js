// Runs when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateHomepage(); // Update the homepage on page load
});

// Function to update the homepage with current product data
function updateHomepage() {
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const lowStockItems = products.filter(product => product.quantity < 10);

  // Update counts
  document.getElementById('newItemsCount').textContent = lowStockItems.length;
  document.getElementById('needStockCount').textContent = lowStockItems.length;

  // Update the stock table dynamically
  const stockTableBody = document.getElementById('stockTableBody');
  stockTableBody.innerHTML = ''; // Clear the current table

  lowStockItems.forEach(item => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;

    const stockCell = document.createElement('td');
    stockCell.textContent = item.quantity;

    const recommendationCell = document.createElement('td');
    recommendationCell.textContent = `Order ${10 - item.quantity} more`;

    row.appendChild(nameCell);
    row.appendChild(stockCell);
    row.appendChild(recommendationCell);

    stockTableBody.appendChild(row);
  });
  
  // Display username
  const username = localStorage.getItem('username') || 'User';
  document.getElementById('usernameDisplay').textContent = username;
}

// Function to add new item and update the homepage without reloading the page
function addNewItem(name, quantity) {
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const newItem = {
    name: name,
    quantity: quantity,
    isNew: true,  // Flag the item as new
  };

  // Add the new item to the products array
  products.push(newItem);
  localStorage.setItem('products', JSON.stringify(products));

  // Call updateHomepage to refresh the stock table and counts
  updateHomepage();
}
