document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      // ✅ Admin login (hardcoded)
      if (email === "admin@enkonix.in" && password === "admin123") {
        const adminUser = {
          firstName: "Admin",
          lastName: "",
          email: "admin@enkonix.in",
          role: "admin"
        };
        sessionStorage.setItem("loggedInUser", JSON.stringify(adminUser));
        window.location.href = "dashboard.html";
        return;
      }

      // ✅ Normal user login
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert("⚠️ Invalid email or password!");
        return;
      }

      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "index.html"; // redirect to homepage
    });
  }
});
