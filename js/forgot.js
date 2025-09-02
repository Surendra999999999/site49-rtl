document.addEventListener("DOMContentLoaded", () => {
  const verifyForm = document.getElementById("verifyForm");
  const resetForm = document.getElementById("resetForm");
  const successMsg = document.getElementById("successMsg");

  let currentUserEmail = "";

  // ✅ Step 1: Verify Email
  verifyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(u => u.email === email);

    if (!userExists) {
      alert("❌ Email not found! Please signup first.");
      return;
    }

    currentUserEmail = email;
    verifyForm.style.display = "none";
    resetForm.style.display = "block";
  });

  // ✅ Step 2: Reset Password
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

    if (newPassword !== confirmNewPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(u => {
      if (u.email === currentUserEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(users));

    resetForm.style.display = "none";
    successMsg.style.display = "block";
  });
});
