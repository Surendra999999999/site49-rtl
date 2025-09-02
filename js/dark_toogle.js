const toggle = document.getElementById("toggle-dark");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  toggle.textContent = "☀️";
} else {
  toggle.textContent = "🌙";
}

// Toggle theme on click
toggle.addEventListener("click", () => {
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    toggle.textContent = "🌙";
  } else {
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    toggle.textContent = "☀️";
  }
});
