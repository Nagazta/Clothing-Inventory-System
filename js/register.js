document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    let username = document.getElementById("username").value.trim();
    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let cPassword = document.getElementById("confirmPassword").value.trim();
  
    if (!username || !fullName || !email || !password || !cPassword) {
      alert("All fields are required!");
      return;
    }
  
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
  
    if (password !== cPassword) {
      alert("PASSWORDS DO NOT MATCH!");
      return;
    }
  
    let userData = {
      username: username,
      fullName: fullName,
      email: email,
      password: password
    };
  
    localStorage.setItem("user", JSON.stringify(userData));
  
    alert("Registration successful! Redirecting to login page.");
    window.location.href = "login.html";
  });
  