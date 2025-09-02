
document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggles = document.querySelectorAll(".nav-links li.dropdown > a");

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault(); // stop navigation
      const parent = toggle.parentElement;

      // Close other dropdowns first
      document.querySelectorAll(".nav-links li.dropdown").forEach(item => {
        if (item !== parent) item.classList.remove("open");
      });

      // Toggle current dropdown
      parent.classList.toggle("open");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-links")) {
      document.querySelectorAll(".nav-links li.dropdown").forEach(item => {
        item.classList.remove("open");
      });
    }
  });
});
