document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No user data found. Redirecting to registration.");
        window.location.href = "register.html";
        return;
    }

    // Populate profile form with first, middle, and last names
    document.getElementById("Uname").value = user.username || "";
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("middleName").value = user.middleName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";

    // Populate info box with full name
    const fullName = `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`.trim();
    document.getElementById("infoUsername").textContent = user.username || "";
    document.getElementById("infoFullName").textContent = fullName || "";
    document.getElementById("infoEmail").textContent = user.email || "";

    // Save profile changes
    document.getElementById("saveProfileBtn").addEventListener("click", () => {
        user.firstName = document.getElementById("firstName").value.trim();
        user.middleName = document.getElementById("middleName").value.trim();
        user.lastName = document.getElementById("lastName").value.trim();
        user.email = document.getElementById("email").value.trim();

        localStorage.setItem("user", JSON.stringify(user));

        // Update info box with new name
        const updatedFullName = `${user.firstName} ${user.middleName} ${user.lastName}`.trim();
        document.getElementById("infoFullName").textContent = updatedFullName;

        // Inform the user that profile was updated
        showToast("Profile updated!");
    });

    // Handle password change
    document.getElementById("passwordForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const current = document.getElementById("Cpassword").value;
        const newPass = document.getElementById("Npassword").value;
        const retype = document.getElementById("Rpassword").value;

        if (current !== user.password) {
            showToast("Incorrect current password.");
            return;
        }
        if (newPass === current) {
            showToast("New password must be different.");
            return;
        }
        if (newPass.length < 6) {
            showToast("Password must be at least 6 characters.");
            return;
        }
        if (newPass !== retype) {
            showToast("Passwords do not match.");
            return;
        }

        user.password = newPass;
        localStorage.setItem("user", JSON.stringify(user));

        showToast("Password changed successfully!");
        document.getElementById("passwordForm").reset();
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
});

// Toast notification function
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}
