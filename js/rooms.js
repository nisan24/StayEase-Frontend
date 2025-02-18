document.addEventListener("DOMContentLoaded", function () {
  const roomsContainer = document.getElementById("roomsContainer");
  const searchInput = document.getElementById("search-input");
  const checkinInput = document.getElementById("checkin-date");
  const checkoutInput = document.getElementById("checkout-date");
  const guestFilter = document.getElementById("guest-filter");
  const clearFilters = document.getElementById("clear-filters");

  roomsContainer.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  let roomsData = [];

  fetch(`http://127.0.0.1:8000/api/hotels/room/list/`)
    .then((res) => res.json())
    .then((rooms) => {
      console.log("data: ", rooms);
      roomsData = rooms;
      displayRooms(rooms);
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
      roomsContainer.innerHTML =
        "<h3 class='text-center text-danger'>Failed to load rooms!</h3>";
    });

  function displayRooms(rooms) {
    roomsContainer.innerHTML = "";

    if (rooms.length === 0) {
      roomsContainer.innerHTML =
        '<div class="alert alert-warning text-center">No rooms found.</div>';
      return;
    }

    rooms.forEach((room) => {
      console.log("r", room);
      const roomCard = document.createElement("div");
      roomCard.className = "room-card";

      roomCard.innerHTML = `
        <div class="room-img" style="background: url('${
          room.image
        }') center/cover no-repeat;">
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
                  `<li><i class="bi bi-check-circle-fill text-dark me-2"></i>${amenity}</li>`
              )
              .join("")}
          </ul>
          <span class="read-more"><a href="room-details.html?hotel_id=${
            room.hotel
          }&room_id=${room.id}" class="read-more">Read More</a></span>
        </div>
      `;
      roomsContainer.appendChild(roomCard);
    });
  }

  searchInput.addEventListener("input", applyFilters);

  guestFilter.addEventListener("change", applyFilters);

  flatpickr("#checkin-date", {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function (selectedDates, dateStr) {
      checkoutInput._flatpickr.set("minDate", dateStr);
      applyFilters();
    },
  });

  flatpickr("#checkout-date", {
    dateFormat: "Y-m-d",
    minDate: "today",
    onChange: function () {
      applyFilters();
    },
  });

  clearFilters.addEventListener("click", function () {
    searchInput.value = "";
    checkinInput.value = "";
    checkoutInput.value = "";
    guestFilter.value = "";

    displayRooms(roomsData);
  });

  function applyFilters() {
    let filteredRooms = roomsData.slice();

    const query = searchInput.value.toLowerCase().trim();
    if (query) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.room_type.toLowerCase().includes(query) ||
          (room.hotel_name && room.hotel_name.toLowerCase().includes(query))
      );
    }

    const checkinDate = checkinInput.value;
    const checkoutDate = checkoutInput.value;

    if (checkinDate) {
      filteredRooms = filteredRooms.filter(
        (room) => room.available_from <= checkinDate
      );
    }

    if (checkoutDate) {
      filteredRooms = filteredRooms.filter(
        (room) => room.available_to >= checkoutDate
      );
    }

    const guests = guestFilter.value;
    if (guests) {
      filteredRooms = filteredRooms.filter(
        (room) => room.guests == guests || (guests === "4+" && room.guests >= 4)
      );
    }

    displayRooms(filteredRooms);
  }
});
