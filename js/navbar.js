document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  navbar.innerHTML = "";

  navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="index.html">StayEase</a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div
          class="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul class="navbar-nav gap-3">
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="rooms.html">Rooms</a></li>
            <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
            <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
            <li class="nav-item">
              <a class="nav-link" href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        <!-- Account Section -->
        <div id="authSection"></div>

      </div>
    </nav>
  `;

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "Guest";
  const authSection = document.getElementById("authSection");

  if (token) {
    authSection.innerHTML = `
        <div class="dropdown">
          <button
            class="btn border-0 dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-user fs-4"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
                <a class="dropdown-item" href="profile.html">
                    <i class="fas fa-user"></i> Profile
                </a>
            </li>
            <li>
                <a class="dropdown-item" href="booking-history.html">
                <i class="fas fa-calendar-alt me-2"></i> My bookings
                </a>
            </li>
            <li>
                <a class="dropdown-item" href="#" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
          </ul>
        </div>
    `;
    document
      .getElementById("logoutBtn")
      .addEventListener("click", handleLogout);
  } else {
    authSection.innerHTML = `
        <div class="dropdown">
          <button
            class="btn border-0 dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-user fs-4"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="login.html"
                ><i class="fas fa-sign-in-alt me-2"></i> Login</a
              >
            </li>
            <li>
              <a class="dropdown-item" href="register.html"
                ><i class="fas fa-user-plus me-2"></i> Register</a
              >
            </li>
          </ul>
        </div>
    `;
  }
  let navbarButtons = document.querySelectorAll(
    ".navbar button, .navbar .dropdown-toggle"
  );
});

// Handle Logout
const handleLogout = (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");

  fetch("https://stay-ease-drf.vercel.app/api/accounts/logout/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      localStorage.clear();
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Logout failed!");
      console.error("API error: ", error);
    });
};
