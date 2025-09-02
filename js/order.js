// =======================
// Menu Data
// =======================
const menu = [
  { id: 1, name: "Chicken Biryani", price: 250, category: "biryani", img: "images/download (1).jpeg" },
  { id: 2, name: "Veg Biryani", price: 200, category: "biryani", img: "images/veg-biryani.jpeg" },
  { id: 3, name: "Margherita Pizza", price: 300, category: "pizza", img: "images/Pizza.jpeg" },
  { id: 4, name: "Cheese Burger", price: 150, category: "burger", img: "images/crack burgers -.jpeg" },
  { id: 5, name: "Cold Drink", price: 50, category: "drinks", img: "images/drinks.jpeg" },
  { id: 6, name: "Mutton Biryani", price: 400, category: "biryani", img: "images/mutton-biryani.jpeg" },
  { id: 7, name: "Chicken Biryani", price: 250, category: "biryani", img: "images/download (1).jpeg" },
  { id: 8, name: "Margherita Pizza", price: 300, category: "pizza", img: "images/Pizza.jpeg" },
  { id: 9, name: "Cheese Burger", price: 150, category: "burger", img: "images/crack burgers -.jpeg" },
  { id: 10, name: "Cold Drink", price: 50, category: "drinks", img: "images/drinks.jpeg" },
  { id: 11, name: "Cheese Burger", price: 200, category: "burger", img: "images/crack burgers -.jpeg" },
  { id: 12, name: "Cheese Burger", price: 100, category: "burger", img: "images/crack burgers -.jpeg" },
  { id: 13, name: "Margherita Pizza", price: 2500, category: "pizza", img: "images/Pizza.jpeg" },
  { id: 14, name: "Margherita Pizza", price: 150, category: "pizza", img: "images/Pizza.jpeg" },
];

const menuGrid = document.getElementById("menuGrid");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPopup = document.getElementById("checkoutPopup");

let cart = [];

// =======================
// Render Menu
// =======================
function renderMenu(items) {
  menuGrid.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="price">₹${item.price}</p>
      <button class="add-cart" onclick="addToCart(${item.id}, this)">Add to Cart</button>
    `;
    menuGrid.appendChild(div);
  });
}
renderMenu(menu);

// =======================
// Add to Cart
// =======================
function addToCart(id, btn) {
  let item = menu.find(m => m.id === id);
  let existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();

  // Button animation
  btn.classList.add("added");
  setTimeout(() => btn.classList.remove("added"), 500);
}

// =======================
// Update Cart
// =======================
function updateCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    let li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price * item.qty}
      <div class="quantity-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
        <button class="remove-item" onclick="removeItem(${item.id})">X</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = `Total: ₹${total}`;
}

// =======================
// Change Quantity
// =======================
function changeQty(id, delta) {
  let item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCart();
}

// =======================
// Remove Item
// =======================
function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

// =======================
// Checkout
// =======================
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Load previous orders
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  // ✅ Logged-in user from sessionStorage
  let userData = sessionStorage.getItem("loggedInUser");
  let user = "Guest";

  try {
    let parsedUser = JSON.parse(userData);
    if (parsedUser) {
      user = parsedUser.fullName || (parsedUser.firstName + " " + (parsedUser.lastName || ""));
    }
  } catch {
    user = "Guest";
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Save new order
  orders.push({
    user,
    items: cart,
    total,
    date: new Date().toISOString(),
    status: "Pending"   // ✅ status added for dashboard use
  });
  localStorage.setItem("orders", JSON.stringify(orders));

  // Show popup + reset
  checkoutPopup.style.display = "flex";
  setTimeout(() => {
    checkoutPopup.style.display = "none";
    cart = [];
    updateCart();
  }, 5000);
});

// =======================
// Filters
// =======================
const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");

searchBar.addEventListener("input", filterMenu);
categoryFilter.addEventListener("change", filterMenu);

function filterMenu() {
  const searchVal = searchBar.value.toLowerCase();
  const categoryVal = categoryFilter.value;

  let filtered = menu.filter(item =>
    item.name.toLowerCase().includes(searchVal) &&
    (categoryVal === "all" || item.category === categoryVal)
  );

  renderMenu(filtered);
}
