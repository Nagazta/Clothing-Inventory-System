document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let storedUser = JSON.parse(localStorage.getItem("user"));
  
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      alert("Login successful!");
      window.location.href = "HomeScreen.html";
    } else {
      alert("Invalid Username or Password");
    }
  });
  