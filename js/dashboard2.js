document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Load Data
  // ==========================
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  // ==========================
  // Summary Cards
  // ==========================
  document.getElementById("totalUsers").innerText = users.length;

  // Group signups by date
  let signupByDate = {};
  users.forEach(user => {
    let date = user.signUpDate ? user.signUpDate.split("T")[0] : "Unknown";
    signupByDate[date] = (signupByDate[date] || 0) + 1;
  });

  // Top signup day
  let topDay = Object.entries(signupByDate).sort((a, b) => b[1] - a[1])[0];
  if (topDay) {
    document.getElementById("topSignupsDay").innerText =
      `${topDay[0]} (${topDay[1]} signups)`;
  }

  // Most active user (just first one for now)
  document.getElementById("mostActiveUser").innerText =
    users.length > 0 ? (users[0].fullName || `${users[0].firstName} ${users[0].lastName}`) : "-";

  // ==========================
  // Users Table
  // ==========================
  const userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";
  users.forEach((user, index) => {
    let row = `
      <tr>
        <td>${user.fullName || (user.firstName + " " + user.lastName)}</td>
        <td>${user.email || "-"}</td>
        <td>${user.signUpDate ? user.signUpDate.split("T")[0] : "-"}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      </tr>
    `;
    userTableBody.innerHTML += row;
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.getAttribute("data-index");
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      location.reload();
    });
  });

  // ==========================
  // Orders Table
  // ==========================
  const ordersTableBody = document.querySelector("#ordersTable tbody");
  ordersTableBody.innerHTML = "";

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="6">No orders yet</td></tr>`;
  } else {
    orders.forEach((order, index) => {
      let itemsList = order.items.map(i => `${i.name} (x${i.qty})`).join(", ");
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.user}</td>
        <td>${itemsList}</td>
        <td>₹${order.total}</td>
        <td>${new Date(order.date).toLocaleString()}</td>
        <td>
          <select class="status-select" data-index="${index}">
            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
            <option value="Completed" ${order.status === "Completed" ? "selected" : ""}>Completed</option>
            <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="delete-order" data-index="${index}">🗑 Delete</button>
        </td>
      `;
      ordersTableBody.appendChild(row);
    });

    // Handle status change
    document.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", (e) => {
        let index = e.target.getAttribute("data-index");
        orders[index].status = e.target.value;
        localStorage.setItem("orders", JSON.stringify(orders));
      });
    });

    // Handle delete
    document.querySelectorAll(".delete-order").forEach(btn => {
      btn.addEventListener("click", (e) => {
        let index = e.target.getAttribute("data-index");
        if (confirm("Are you sure you want to delete this order?")) {
          orders.splice(index, 1);
          localStorage.setItem("orders", JSON.stringify(orders));
          location.reload();
        }
      });
    });
  }

  // ==========================
  // Charts Helper
  // ==========================
  function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  // ==========================
  // Signups Today (Doughnut)
  // ==========================
  let today = new Date().toISOString().split("T")[0];
  let todayCount = signupByDate[today] || 0;
  let remaining = users.length - todayCount;

  new Chart(document.getElementById("signupsTodayChart"), {
    type: "doughnut",
    data: {
      labels: ["Today’s Signups", "Others"],
      datasets: [{
        data: [todayCount, remaining],
        backgroundColor: ["#e74c3c", "#f1f1f1"],
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: {
      cutout: "70%",
      plugins: { legend: { position: "bottom" } }
    }
  });

  // ==========================
  // Weekly Signups (Line)
  // ==========================
  const weeklyCtx = document.getElementById("weeklySignupsChart").getContext("2d");
  new Chart(weeklyCtx, {
    type: "line",
    data: {
      labels: Object.keys(signupByDate),
      datasets: [{
        label: "Signups",
        data: Object.values(signupByDate),
        borderColor: "#e74c3c",
        backgroundColor: createGradient(weeklyCtx, "rgba(231,76,60,0.4)", "rgba(255,140,66,0.1)"),
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#e74c3c",
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // ==========================
  // Total Users (Bar)
  // ==========================
  const totalCtx = document.getElementById("totalUsersChart").getContext("2d");
  new Chart(totalCtx, {
    type: "bar",
    data: {
      labels: ["Users"],
      datasets: [{
        label: "Total Users",
        data: [users.length],
        backgroundColor: createGradient(totalCtx, "#e74c3c", "#ff8c42"),
        borderRadius: 12
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // ==========================
  // Orders by Status (Pie)
  // ==========================
  let statusCount = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(document.getElementById("ordersStatusChart"), {
    type: "pie",
    data: {
      labels: Object.keys(statusCount),
      datasets: [{
        data: Object.values(statusCount),
        backgroundColor: ["#ff8c42", "#e74c3c", "#2ecc71", "#95a5a6"],
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });

  // ==========================
  // Orders per Day (Bar)
  // ==========================
  let ordersByDate = {};
  orders.forEach(o => {
    let d = new Date(o.date).toISOString().split("T")[0];
    ordersByDate[d] = (ordersByDate[d] || 0) + 1;
  });

  const ordersCtx = document.getElementById("ordersDailyChart").getContext("2d");
  new Chart(ordersCtx, {
    type: "bar",
    data: {
      labels: Object.keys(ordersByDate),
      datasets: [{
        label: "Orders",
        data: Object.values(ordersByDate),
        backgroundColor: createGradient(ordersCtx, "#6c5ce7", "#00cec9"),
        borderRadius: 10
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
});
