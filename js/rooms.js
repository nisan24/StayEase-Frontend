document.addEventListener("DOMContentLoaded", function () {
  fetch(`http://127.0.0.1:8000/api/hotels/room/list/`)
    .then((res) => res.json())
    .then((rooms) => {
      displayRooms(rooms);
    })
    .catch((error) => console.error("API Error:", error));

  flatpickr("#checkin-date", {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function (selectedDates, dateStr) {
      const checkoutInput = document.getElementById("checkout-date");
      checkoutInput._flatpickr.set("minDate", dateStr);
    },
  });

  flatpickr("#checkout-date", {
    dateFormat: "Y-m-d",
    minDate: "today",
  });

  document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("checkin-date").value = "";
    document.getElementById("checkout-date").value = "";
    document.getElementById("guest-filter").selectedIndex = 0;

    applyFilters();
  });
});

// ====================

function displayRooms(rooms) {
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";
  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.className = "col-md-6 col-lg-4";
    roomCard.innerHTML = `
                <div class="room-card">
                    <div class="room-card">
                        <img src="${room.image}" alt="${
      room.room_type
    }" class="img-fluid">
                    </div>
                    <div class="card-body p-3">
                        <h5 class="card-title">${room.room_type}</h5>
                        <p class="card-text text-muted">${room.description}</p>
                        <p><strong>Price:</strong> ${
                          room.price_per_night
                        } BDT / night</p>
                        <ul>
                            ${room.amenities
                              .split(", ")
                              .slice(0, 3)
                              .map(
                                (amenity) =>
                                  `<li><i class="fas fa-check-circle text-success me-2"></i>${amenity}</li>`
                              )
                              .join("")}
                        </ul>
                        <a href="room-details.html?hotel_id=${
                          room.hotel
                        }&room_id=${room.id}" class="btn btn-primary w-100">
                            <i class="fas fa-eye"></i> View Details
                        </a>
                    </div>
                </div>
            `;
    roomsContainer.appendChild(roomCard);
  });
}

// ======================

function applyFilters() {
  let searchQuery = document.getElementById("search-input").value.trim();
  let checkin_date = document.querySelector("#checkin-date").value || "";
  let checkout_date = document.querySelector("#checkout-date").value || "";
  let guest_count = document.getElementById("guest-filter").value || "";

  let queryParams = new URLSearchParams();

  if (checkin_date) queryParams.append("check_in", checkin_date);
  if (checkout_date) queryParams.append("check_out", checkout_date);
  if (guest_count) queryParams.append("guests", guest_count);
  if (searchQuery) queryParams.append("search", searchQuery);

  fetch(
    `http://127.0.0.1:8000/api/hotels/rooms/list/?${queryParams.toString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Filter Data:", data);
      displayRoom(data);
    })
    .catch((error) => console.error("Filter Error:", error));
}

// =========

let searchInput = document.getElementById("search-input");
let typingTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    applyFilters();
  }, 100);
});

//===============
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    applyFilters();
  }
});

//===== search input Blank thakle =====
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    applyFilters();
  }
});

// ===========================

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("#checkin-date, #checkout-date, #guest-filter")
    .forEach((element) => {
      element.addEventListener("change", applyFilters);
    });
});
