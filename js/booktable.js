document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const confirmation = document.getElementById("confirmation");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form values
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const guests = document.getElementById("guests").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const message = document.getElementById("message").value.trim();

    if (!fullName || !phone || !guests || !date || !time) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    // Normally: send data to server (API call)
    console.log({
      fullName, phone, guests, date, time, message
    });

    // Show confirmation
    form.reset();
    form.parentElement.style.display = "none";
    confirmation.classList.remove("hidden");
  });
});
