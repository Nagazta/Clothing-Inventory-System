document.addEventListener('DOMContentLoaded', () => {
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const lowStockItems = products.filter(product => product.quantity < 10 && !product.isNew);

  document.getElementById('newItemsCount').textContent = lowStockItems.length;
  document.getElementById('needStockCount').textContent = lowStockItems.length;

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

  const username = localStorage.getItem('username') || 'User';
  document.getElementById('usernameDisplay').textContent = username;
});

function addNewItem(name, quantity) {
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const newItem = {
    name: name,
    quantity: quantity,
    isNew: true, 
  };

  products.push(newItem);
  localStorage.setItem('products', JSON.stringify(products));

  if (newItem.quantity < 10) {
    const lowStockItems = products.filter(product => product.quantity < 10);
    document.getElementById('newItemsCount').textContent = lowStockItems.length;
    document.getElementById('needStockCount').textContent = lowStockItems.length;
  }
}
