document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let storedUser = JSON.parse(localStorage.getItem("user"));
  const messageContainer = document.getElementById("login-message");

  messageContainer.style.display = "none";
  messageContainer.textContent = "";

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    messageContainer.textContent = "Login successful!";
    messageContainer.style.color = "lightgreen";
    messageContainer.style.display = "block";

    setTimeout(() => {
      window.location.href = "HomeScreen.html";
    }, 1500);
  } else {
    messageContainer.textContent = "Invalid Username or Password";
    messageContainer.style.color = "red";
    messageContainer.style.display = "block";

    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 3000);
  }
});
