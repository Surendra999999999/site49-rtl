document.addEventListener("DOMContentLoaded", () => {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  // ====== Orders by Status ======
  let statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById("ordersStatusChart"), {
    type: "pie",
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ["#e74c3c", "#ff8c42", "#6c5ce7", "#2ecc71", "#95a5a6"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } }
    }
  });

  // ====== Orders per Day ======
  let ordersByDate = {};
  orders.forEach(o => {
    let d = new Date(o.date).toISOString().split("T")[0];
    ordersByDate[d] = (ordersByDate[d] || 0) + 1;
  });

  new Chart(document.getElementById("ordersDailyChart"), {
    type: "bar",
    data: {
      labels: Object.keys(ordersByDate),
      datasets: [{
        label: "Orders",
        data: Object.values(ordersByDate),
        backgroundColor: "#6c5ce7"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    }
  });
});
