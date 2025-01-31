document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");

  navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg fixed-top bg-light shadow">
        <div class="container-fluid px-4">
            <a class="navbar-brand fw-bold text-primary" href="index.html">StayEase</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="rooms.html">Rooms</a></li>
                    <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About Us</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact-us.html">Contact Us</a></li>
                </ul>
                <div class="d-flex align-items-center gap-3" id="authSection"></div>
            </div>
        </div>
    </nav>
  `;

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "Guest";
  const authSection = document.getElementById("authSection");

  if (token) {
    authSection.innerHTML = `
      <div class="d-flex align-items-center gap-4">
        <div class="dropdown ms-3">
            <a class="btn btn-outline-primary dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user-circle fa-lg me-2"></i> ${name}
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow mt-2">
                <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user me-2"></i> Profile</a></li>
                <li><a class="dropdown-item" href="bookings.html"><i class="fas fa-calendar-alt me-2"></i> My Bookings</a></li>
                <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i> Logout</a></li>
            </ul>
        </div>
      </div>
    `;
    document
      .getElementById("logoutBtn")
      .addEventListener("click", handleLogout);
  } else {
    authSection.innerHTML = `
      <a class="btn btn-primary" href="register.html">Register</a>
      <a class="btn btn-outline-primary" href="login.html">Login</a>
    `;
  }
});

// Handle Logout
const handleLogout = (event) => {
  event.preventDefault();
  const token = localStorage.getItem("token");

  fetch("http://127.0.0.1:8000/api/accounts/logout/", {
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

