function get_Hotel_id() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
console.log("ID: ", get_Hotel_id());

// =================

document.addEventListener("DOMContentLoaded", function () {
  // Fetch Hotel
  // fetch(`https://stay-ease-drf.vercel.app/api/hotels/list/${get_Hotel_id()}/`)
  //   .then((res) => res.json())
  //   .then((hotel) => {
  //     console.log("Hotel-data: ", hotel);
  //     displayHotel(hotel);
  //   })
  //   .catch((error) => console.error("API Error:", error));

  // Fetch Rooms
  fetch(
    `https://stay-ease-drf.vercel.app/api/hotels/rooms/?hotel_id=${get_Hotel_id()}`
  )
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

// ==========

const roomsContainer = document.getElementById("roomsContainer");

roomsContainer.innerHTML = `
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

function displayRoom(rooms) {
  roomsContainer.innerHTML = "";
  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.className = "room-card";
    const room_img = `https://res.cloudinary.com/dfqwj2lfu/${room.image}`;

    roomCard.innerHTML = `
        <div class="room-img" style="background: url('${room_img}') center/cover no-repeat;">
          <span class="price-tag" id="room-price"><strong>$${
            room.price_per_night
          } / Night</strong></span>
        </div>
        <div class="room-info">
          <div class="room-name" id="room-name">${room.room_type}</div>
          <p class="room-description" id="room-description">
            ${room.description.split(" ").slice(0, 10).join(" ") + "..."}
          </p>
          <ul class="list-unstyled">
            ${room.amenities
              .split(", ")
              .slice(0, 3)
              .map(
                (amenity) =>
                  `<li><i class="bi bi-check-circle-fill text-success me-2"></i>${amenity}</li>`
              )
              .join("")}
          </ul>
          <span class="read-more"><a href="room-details.html?hotel_id=${get_Hotel_id()}&room_id=${
      room.id
    }" class="read-more">Read More</a></span>
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
    `https://stay-ease-drf.vercel.app/api/hotels/rooms/?hotel_id=${get_Hotel_id()}&${queryParams.toString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Filter Data:", data);
      displayRoom(data);
    })
    .catch((error) => console.error("Filter Error:", error));
}

// ====================

let searchInput = document.getElementById("search-input");
let typingTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    applyFilters();
  }, 20);
});

// ====================

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

// ====================

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("#checkin-date, #checkout-date, #guest-filter")
    .forEach((element) => {
      element.addEventListener("change", applyFilters);
    });
});
