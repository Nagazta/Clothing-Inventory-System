document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get field values
  let username = document.getElementById("username").value.trim();
  let lastName = document.getElementById("lastName").value.trim();
  let firstName = document.getElementById("firstName").value.trim();
  let middleName = document.getElementById("middleName").value.trim(); // optional
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let cPassword = document.getElementById("confirmPassword").value.trim();

  // Reset all errors
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");

  let isValid = true;

  if (!username) {
      document.getElementById("usernameError").textContent = "Username is required.";
      isValid = false;
  }

  if (!lastName) {
      document.getElementById("lastNameError").textContent = "Last name is required.";
      isValid = false;
  }

  if (!firstName) {
      document.getElementById("firstNameError").textContent = "First name is required.";
      isValid = false;
  }

  if (!email) {
      document.getElementById("emailError").textContent = "Email is required.";
      isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("emailError").textContent = "Invalid email format.";
      isValid = false;
  }

  if (!password) {
      document.getElementById("passwordError").textContent = "Password is required.";
      isValid = false;
  } else if (password.length < 6) {
      document.getElementById("passwordError").textContent = "Password must be at least 6 characters.";
      isValid = false;
  }

  if (!cPassword) {
      document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
      isValid = false;
  } else if (password !== cPassword) {
      document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
      isValid = false;
  }

  if (!isValid) return;

  // Store user
  let userData = {
      username: username,
      lastName: lastName,
      firstName: firstName,
      middleName: middleName,
      email: email,
      password: password
  };

  localStorage.setItem("user", JSON.stringify(userData));

  const toast = document.getElementById("toast");
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
    window.location.href = "login.html";
  }, 2000);
  
  
  
});
