// js/header.js
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle"); // hamburger
  const navMenu = document.querySelector(".nav-links"); // main nav UL
  const profileNameEl = document.getElementById("profileName");
  const profileDropdownToggle = document.getElementById("profile-dropdown-toggle");
  const profileDropdown = document.getElementById("profile-dropdown");
  const profilePic = document.getElementById("profile-pic");
  const profileInitials = document.getElementById("profile-initials");
  const logoutBtn = document.getElementById("logout-btn");

  // Helpers
  const isMobile = () => window.innerWidth <= 768;
  const closeAllDropdowns = () => {
    document.querySelectorAll(".nav-links .dropdown").forEach(li => li.classList.remove("open"));
  };
  const closeMobileMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove("mobile-active");
    closeAllDropdowns();
  };

  // ----- MOBILE MENU TOGGLE -----
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const opened = navMenu.classList.toggle("mobile-active");
      if (!opened) closeAllDropdowns();
    });
  }

  // ----- DROPDOWN (mobile: click toggle; desktop: handled by CSS hover) -----
  document.querySelectorAll(".nav-links .dropdown > a").forEach(link => {
    link.addEventListener("click", (e) => {
      if (!isMobile()) return; // desktop uses hover
      e.preventDefault();
      e.stopPropagation();

      const li = link.parentElement;
      const willOpen = !li.classList.contains("open");
      // close others first
      closeAllDropdowns();
      // toggle this one
      if (willOpen) li.classList.add("open"); else li.classList.remove("open");
    });
  });

  // ----- CLOSE ON OUTSIDE TAP (mobile) -----
  document.addEventListener("click", (e) => {
    if (!isMobile()) return;
    const clickedInsideNav = navMenu && navMenu.contains(e.target);
    const clickedHamburger = mobileMenuBtn && mobileMenuBtn.contains(e.target);
    if (!clickedInsideNav && !clickedHamburger) {
      closeMobileMenu();
    }
  });

  // ----- CLOSE MENU AFTER ANY NAV LINK CLICK (mobile) -----
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => {
      if (isMobile()) closeMobileMenu();
    });
  });

  // ----- RESET ON RESIZE TO DESKTOP -----
  window.addEventListener("resize", () => {
    if (!isMobile()) {
      closeAllDropdowns();
      if (navMenu) navMenu.classList.remove("mobile-active");
    }
  });

  // ----- LOAD USER (unchanged) -----
  const user = JSON.parse(sessionStorage.getItem("loggedInUser")) 
            || JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    if (!user.profilePic || user.profilePic === "") {
      if (profilePic) profilePic.style.display = "none";
      const initials = `${(user.firstName || user.username?.[0] || "").charAt(0).toUpperCase()}${(user.lastName || "").charAt(0).toUpperCase()}`;
      if (profileInitials) {
        profileInitials.textContent = initials;
        Object.assign(profileInitials.style, {
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "40px", height: "40px", background: "#fff8dc", color: "#ff8c42",
          borderRadius: "50%", fontWeight: "bold"
        });
      }
    } else {
      if (profilePic) { profilePic.src = user.profilePic; profilePic.style.display = "block"; }
      if (profileInitials) profileInitials.style.display = "none";
    }
    if (profileNameEl) {
      profileNameEl.textContent = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";
    }
  } else {
    if (profileNameEl) profileNameEl.textContent = "Guest";
  }

  // ----- PROFILE DROPDOWN (header avatar) -----
  if (profileDropdownToggle && profileDropdown) {
    profileDropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.style.display =
        profileDropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!profileDropdownToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = "none";
      }
    });
  }

  // ----- LOGOUT -----
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  }
});
