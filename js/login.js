function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast"; 
  }, 2500);
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    showToast("Login successful!", "success");
    setTimeout(() => {
      window.location.href = "HomeScreen.html";
    }, 1500);
  } else {
    showToast("Invalid Username or Password", "error");
  }
});
