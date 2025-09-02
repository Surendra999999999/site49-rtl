document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("⚠️ All fields are required!");
        return;
      }

      if (password !== confirmPassword) {
        alert("⚠️ Passwords do not match!");
        return;
      }

      // 🚫 Block reserved admin email
      if (email === "admin@enkonix.in") {
        alert("⚠️ This email is reserved for the admin!");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.some(u => u.email === email)) {
        alert("⚠️ User already exists with this email!");
        return;
      }

      // ✅ Build new user object
      let newUser = {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,   // 👈 store full name here
        email,
        password,
        role: "user",
        signUpDate: new Date().toISOString()   // ISO format is better for charts
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("✅ Signup successful! Please login.");
      window.location.href = "login.html";
    });
  }
});
