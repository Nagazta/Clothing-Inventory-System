// Runs when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateHomepage(); 
});

// Function to update the homepage with current product data
function updateHomepage() {
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const lowStockItems = products.filter(product => product.quantity < 10);
  const newItems = products.filter(product => product.isNew === true);

  // Update counts
  document.getElementById('newItemsCount').textContent = newItems.length;
  document.getElementById('needStockCount').textContent = lowStockItems.length;

  // Update the stock table dynamically
  const stockTableBody = document.getElementById('stockTableBody');
  stockTableBody.innerHTML = ''; 

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

 
 
}

// Function to add a new item (optional use elsewhere)
function addNewItem(name, quantity) {
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const newItem = {
    name: name,
    quantity: quantity,
    isNew: true, 
  };

  products.push(newItem);
  localStorage.setItem('products', JSON.stringify(products));
  updateHomepage();
}
