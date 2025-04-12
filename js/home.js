// Example item data
const lowStockItems = [
    { name: "Denim Jacket", stock: 2, recommended: 10 },
    { name: "Plain White T-Shirt", stock: 5, recommended: 15 },
    { name: "Cargo Pants", stock: 3, recommended: 12 }
  ];
  
  // Populate the table
  const tableBody = document.getElementById("stockTableBody");
  lowStockItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.stock}</td>
      <td>${item.recommended}</td>
    `;
    tableBody.appendChild(row);
  });
  