document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  // ===== Summary Cards =====
  document.getElementById("totalUsers").innerText = users.length;

  let signupByDate = {};
  users.forEach(user => {
    let date = user.signUpDate ? user.signUpDate.split("T")[0] : "Unknown";
    signupByDate[date] = (signupByDate[date] || 0) + 1;
  });

  let topDay = Object.entries(signupByDate).sort((a, b) => b[1] - a[1])[0];
  if (topDay) {
    document.getElementById("topSignupsDay").innerHTML = 
      `${topDay[0]} (${topDay[1]} signups)`;
  }

  document.getElementById("mostActiveUser").innerText = 
    users.length > 0 ? (users[0].fullName || users[0].firstName + " " + users[0].lastName) : "-";

  // ===== Users Table =====
  const userTableBody = document.getElementById("userTableBody");
  userTableBody.innerHTML = "";
  users.forEach((user, index) => {
    let row = `
      <tr>
        <td>${user.fullName || (user.firstName + " " + user.lastName)}</td>
        <td>${user.email}</td>
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


  // ===== Charts =====
  new Chart(document.getElementById("totalUsersChart"), {
    type: "line",
    data: {
      labels: Object.keys(signupByDate),
      datasets: [{
        label: "Total Users",
        data: Object.values(signupByDate),
        borderColor: "#e74c3c",
        fill: false
      }]
    }
  });

  let today = new Date().toISOString().split("T")[0];
  let todayCount = signupByDate[today] || 0;
  new Chart(document.getElementById("signupsTodayChart"), {
    type: "bar",
    data: {
      labels: [today],
      datasets: [{
        label: "New Signups",
        data: [todayCount],
        backgroundColor: "#ff8c42"
      }]
    }
  });

  new Chart(document.getElementById("weeklySignupsChart"), {
    type: "line",
    data: {
      labels: Object.keys(signupByDate),
      datasets: [{
        label: "Weekly Signups",
        data: Object.values(signupByDate),
        borderColor: "#6c5ce7",
        fill: false
      }]
    }
  });

  let rolesCount = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  new Chart(document.getElementById("userRolesChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(rolesCount),
      datasets: [{
        data: Object.values(rolesCount),
        backgroundColor: ["#e74c3c", "#ff8c42", "#6c5ce7"]
      }]
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const ordersTableBody = document.querySelector("#ordersTable tbody");

  // ✅ Get orders from localStorage
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="5">No orders yet</td></tr>`;
    return;
  }

  // ✅ Render each order
  orders.forEach(order => {
    let itemsList = order.items.map(i => `${i.name} (x${i.qty})`).join(", ");

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.user}</td>
      <td>${itemsList}</td>
      <td>₹${order.total}</td>
      <td>${new Date(order.date).toLocaleString()}</td>
      <td>${order.status}</td>
    `;

    ordersTableBody.appendChild(row);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const ordersTableBody = document.querySelector("#ordersTable tbody");

  // ✅ Get orders from localStorage
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="6">No orders yet</td></tr>`;
    return;
  }

  // ✅ Render each order
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

  // ✅ Handle status change
  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", (e) => {
      let index = e.target.getAttribute("data-index");
      orders[index].status = e.target.value;
      localStorage.setItem("orders", JSON.stringify(orders));
    });
  });

  // ✅ Handle delete order
  document.querySelectorAll(".delete-order").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.getAttribute("data-index");
      if (confirm("Are you sure you want to delete this order?")) {
        orders.splice(index, 1); // remove order
        localStorage.setItem("orders", JSON.stringify(orders));
        location.reload(); // refresh table
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  // Signups Today (Donut)
  new Chart(document.getElementById("signupsTodayChart"), {
    type: "doughnut",
    data: {
      labels: ["Today’s Signups", "Remaining"],
      datasets: [{
        data: [25, 75], // Example: 25 signups today
        backgroundColor: ["#e74c3c", "#ff8c42"]
      }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });

  // Weekly Signups (Line)
  new Chart(document.getElementById("weeklySignupsChart"), {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Signups",
        data: [5, 8, 12, 9, 15, 7, 10],
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231,76,60,0.2)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true }
  });

  // Total Users (Bar)
  new Chart(document.getElementById("totalUsersChart"), {
    type: "bar",
    data: {
      labels: ["Users"],
      datasets: [{
        label: "Total Users",
        data: [320], // Example
        backgroundColor: ["#ff8c42"]
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Orders by Status (Pie)
  new Chart(document.getElementById("ordersStatusChart"), {
    type: "pie",
    data: {
      labels: ["Pending", "Processing", "Completed"],
      datasets: [{
        data: [10, 15, 30],
        backgroundColor: ["#ff8c42", "#e74c3c", "#2ecc71"]
      }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });

  // Orders per Day (Bar)
  new Chart(document.getElementById("ordersDailyChart"), {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Orders",
        data: [4, 6, 8, 12, 10, 15, 7],
        backgroundColor: "#6c5ce7"
      }]
    },
    options: { responsive: true }
  });
});


