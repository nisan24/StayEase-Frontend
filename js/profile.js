const profileContainer = document.getElementById("profile-container");
profileContainer.innerHTML = "";

const token = localStorage.getItem("token");
if (!token) {
  console.error("Token not found!");
}

fetch("https://stay-ease-drf.vercel.app/api/accounts/profile/", {
  method: "GET",
  headers: {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log("data: ", data);

    profileContainer.innerHTML = `
            <img src="./img/profile.jpg" alt="Profile Picture">
            <h2>${data.first_name} ${data.last_name}</h2>
            <p><i class="fas fa-envelope"></i> ${data.email}</p>
            <p><i class="fas fa-user"></i> ${data.username}</p>
            <p><i class="fas fa-phone"></i> ${data.phone || "Not Provided"}</p>
            <p><i class="fas fa-calendar"></i> Joined: ${
              data.join_date || "Unknown"
            }
            </p>
            <!-- <button class="btn btn-danger mt-2" id="logoutBtn">Logout</button> -->
          `;
  })
  .catch((error) => {
    console.log("API Error: ", error);
    profileContainer.innerHTML =
      "<p class='text-danger'>Failed to load profile</p>";
  });
