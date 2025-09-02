// ✅ Auth check
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    // Not logged in → force login
    window.location.href = "login.html";
  } else if (loggedInUser.role === "admin" && window.location.pathname.includes("index.html")) {
    // 🚫 Prevent admin from opening user pages
    window.location.href = "dashboard.html";
  }
});

// ✅ Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }
});
