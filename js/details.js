function get_Hotel_id() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
console.log("ID: ", get_Hotel_id());

// =================

document.addEventListener("DOMContentLoaded", function () {
  // Fetch Hotel Details
  fetch(`http://127.0.0.1:8000/api/hotels/list/${get_Hotel_id()}/`)
    .then((res) => res.json())
    .then((hotel) => {
      console.log("Hotel-data: ", hotel);
      displayHotel(hotel);
    })
    .catch((error) => console.error("API Error:", error));

  // Fetch Rooms
  fetch(`http://127.0.0.1:8000/api/hotels/rooms/?hotel_id=${get_Hotel_id()}`)
    .then((res) => res.json())
    .then((rooms) => {
      console.log("room-data: ", rooms);
      displayRoom(rooms);
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
      document.getElementById("rooms-container").innerHTML =
        "<h3 class='text-center text-danger'>Failed to load rooms!</h3>";
    });

  // Initialize Flatpickr
  // flatpickr("#checkin-date", {
  //   dateFormat: "Y-m-d",
  //   minDate: "today",
  // });

  // flatpickr("#checkout-date", {
  //   dateFormat: "Y-m-d",
  //   minDate: "today",
  // });

  // Initialize Flatpickr
  //   flatpickr("#checkin-date", {
  //     dateFormat: "d-m-Y",
  //     minDate: "today",
  //   });

  //   flatpickr("#checkout-date", {
  //     dateFormat: "d-m-Y",
  //     minDate: "today",
  //   });

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

// =============

function displayHotel(hotel) {
  document.getElementById("hotel-name").textContent = hotel.name;
  document.getElementById(
    "hotel-address"
  ).textContent = `${hotel.address}, ${hotel.city}, ${hotel.country}`;
  document.getElementById("hotel-description").textContent = hotel.description;
  document.getElementById(
    "price-range"
  ).textContent = `$${hotel.price_range_min} - $${hotel.price_range_max}`;
  document.getElementById("hotel-image").src = hotel.image;

  const amenities = hotel.amenities.split(", ");
  const amenitiesContainer = document.getElementById("hotel-amenities");
  amenities.forEach((amenity) => {
    const span = document.createElement("span");
    span.classList.add("icon-item");
    span.innerHTML = `<i class="fas fa-check-circle text-success"></i> ${amenity}`;
    amenitiesContainer.appendChild(span);
  });
}

// ==========

function displayRoom(rooms) {
  const roomsContainer = document.getElementById("rooms-container");
  roomsContainer.innerHTML = "";
  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.innerHTML = "";
    roomCard.className = "col-md-6 col-lg-4";
    roomCard.innerHTML = `
                <div class="room-card">
                    <img src="${room.image}" alt="${
      room.room_type
    }" class="img-fluid">
                    <div class="p-3">
                        <h5>${room.room_type}</h5>
                        <p><strong>Price:</strong> $${
                          room.price_per_night
                        } / night</p>
                        <p class="text-muted small">${room.description}</p>
                        <ul>
                            ${room.amenities
                              .split(", ")
                              .slice(0, 3)
                              .map(
                                (amenity) =>
                                  `<li><i class="bi bi-check-circle-fill text-success me-2"></i>${amenity}</li>`
                              )
                              .join("")}
                        </ul>
                        <!-- <a href="room_details.html?id=${
                          room.id
                        }" class="btn btn-primary w-100">View Details</a> -->

                          <a href="room-details.html?hotel_id=${get_Hotel_id()}&room_id=${
      room.id
    }" class="btn btn-primary w-100">
                            <i class="bi bi-arrow-right-circle me-1"></i> View Details
                          </a>
                    </div>
                </div>
              `;
    roomsContainer.appendChild(roomCard);
  });
}

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
    `http://127.0.0.1:8000/api/hotels/rooms/?hotel_id=${get_Hotel_id()}&${queryParams.toString()}`
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
