function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// =======================

document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = `https://stay-ease-drf.vercel.app/api/hotels/rooms/?hotel_id=${getQueryParam(
    "hotel_id"
  )}&room_id=${getQueryParam("room_id")}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log("Room Data:", data);
      displayRoomDetails(data[0]);
      ShowDatePickers();
      disableBookedDates();
    })
    .catch((error) => console.error("API Error: ", error));
});

function displayRoomDetails(data) {
  if (!data) {
    console.error("No room data found");
    return;
  }

  const roomContainer = document.getElementById("room-details-container");
  roomContainer.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  const calculatePrice = () => {
    const checkin = document.getElementById("checkin-date").value;
    const checkout = document.getElementById("checkout-date").value;
    const priceElement = document.getElementById("price-section");

    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      if (checkinDate.getTime() === checkoutDate.getTime()) {
        alert("Check-out date must be at least 1 day after Check-in date.");
        document.getElementById("checkout-date").value = "";
        priceElement.innerHTML = "Add dates for prices";
        document.getElementById("total-price").innerHTML = "";
        return;
      }

      const nights = Math.ceil(
        (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = nights * parseFloat(data.price_per_night);
      priceElement.innerHTML = `$${data.price_per_night} / night`;
      document.getElementById("total-price").innerHTML = `
      <span>$${data.price_per_night} x ${nights} nights: $${totalPrice}</span>
      <span>Cleaning Fee: $50</span>
      <span>Service Fee: $120</span>
      <hr />
      <span><strong>Total: $${totalPrice + 50 + 120}</strong></span>
    `;
    } else {
      priceElement.innerHTML = "Add dates for prices";
      document.getElementById("total-price").innerHTML = "";
    }
    validateForm();
  };

  roomContainer.innerHTML = "";

  roomContainer.innerHTML = `
    <div class="roomDetailsContainer mt-3">
      <h2>${data.hotel_name} - ${data.room_type}</h2>
    </div>
    <div class="roomDetailsContainer cl">
      <div class="column big-column">
        ${data.room_images
          .slice(0, 1)
          .map(
            (img) =>
              `<img src="${img.image}" alt="Extra Image" class="extra-img first-img" />`
          )
          .join("")}
      </div>
      <div class="column small-column">
        ${data.room_images
          .slice(1, 3)
          .map(
            (img) =>
              `<img src="${img.image}" alt="Extra Image" class="extra-img" />`
          )
          .join("")}
      </div>
      <div class="column small-column">
        ${data.room_images
          .slice(3, 5)
          .map((img, index) => {
            const imgClass = index === 0 ? "fourth-img" : "five-img";
            return `<img src="${img.image}" alt="Extra Image" class="extra-img ${imgClass}" />`;
          })
          .join("")}
          <button class="show-all-btn">Show All Images</button>
      </div>
    </div>


  <div class="roomContainer">   
    <div class="row">
        <div class="col-lg-8">

          <div class="roomContainer">
            <div class="info">
              <h3>${data.title || "N/A"}</h3>
              <h4>${data.beds} beds &#183; ${
    data.bathrooms
  } private bathrooms</h4>
              <strong>⭐ ${AverageRating_cal(data.reviews)} - ${
    data.reviews.length
  } reviews</strong>
              <p class="room_desc">${data.description}</p>
            </div>

           <br>

              <!-- Room Amenities -->
              <div class="room-amenities mt-4">
                  <h4 class="fw-bold text-dark">Room Amenities</h4>
                  <hr class="mb-2">
                  <ul class="amenities-list d-flex flex-wrap gap-3 list-unstyled">
                      ${generateAmenitiesIcons(data.amenities)}
                  </ul>
              </div>


            </div>
        </div>


<!-- Booking Section -->
<div class="col-lg-4">
    <div class="cart border border-1 p-3">
        <h3 id="price-section" class="fw-bold">Add dates for prices</h3>
        <div>
            <!-- Date Pickers -->
            <div class="d-flex flex-column flex-md-row">
                <div class="input-group me-md-2 mb-2 mb-md-0">
                    <span class="input-group-text text-dark">
                        <i class="bi bi-calendar-event"></i>
                    </span>
                    <input type="text" class="form-control datepicker" id="checkin-date" placeholder="Check-in" readonly />
                    <span class="input-group-text clear-icon" id="clear-checkin">
                        <i class="bi bi-x-circle"></i>
                    </span>
                </div>
                <div class="input-group">
                    <span class="input-group-text text-dark">
                        <i class="bi bi-calendar-check"></i>
                    </span>
                    <input type="text" class="form-control datepicker" id="checkout-date" placeholder="Check-out" readonly />
                    <span class="input-group-text clear-icon" id="clear-checkout">
                        <i class="bi bi-x-circle"></i>
                    </span>
                </div>
            </div>

            <!-- Guests Dropdown -->
            <div class="dropdown mt-2">
                <label for="guests">Guests:</label>
                <select id="guests" class="form-select">
                    ${Array.from({ length: data.guests }, (_, i) => i + 1)
                      .map(
                        (num) =>
                          `<option value="${num}">${num} Guest(s)</option>`
                      )
                      .join("")}
                </select>
            </div>
        </div>
          <!-- btn -->
        <button class="mt-3 text-dark btn w-100" style="background: #B99D75;" onclick="redirectCheckout()" id="reserveBtn" disabled>Reserve</button>

        <!-- Total Price -->
        <div class="cart-details mt-2" id="total-price"></div>
    </div>
</div>

        
    </div>
</div>
  `;

  document
    .getElementById("checkin-date")
    .addEventListener("change", calculatePrice);
  document
    .getElementById("checkout-date")
    .addEventListener("change", calculatePrice);

  document.getElementById("clear-checkin").addEventListener("click", () => {
    document.getElementById("checkin-date").value = "";
    calculatePrice();
  });
  document.getElementById("clear-checkout").addEventListener("click", () => {
    document.getElementById("checkout-date").value = "";
    calculatePrice();
  });
}

function ShowDatePickers() {
  const checkinPicker = document.getElementById("checkin-date");
  const checkoutPicker = document.getElementById("checkout-date");
  if (checkinPicker && checkoutPicker) {
    flatpickr(checkinPicker, {
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: false,
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Check-in date: ", dateStr);
        validateForm();
      },
    });
    flatpickr(checkoutPicker, {
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: false,
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Check-out date: ", dateStr);
        validateForm();
      },
    });
  } else {
    console.error("Datepickers not found");
  }
}

// === Average Rating Calculation ===
function AverageRating_cal(reviews) {
  if (!reviews || reviews.length === 0) return "No Ratings Yet";
  const total_review_star = reviews.reduce(
    (sum, r) => sum + r.rating.length,
    0
  );
  return (total_review_star / reviews.length).toFixed(1);
}

// ============================

function disableBookedDates() {
  const apiURL = `https://stay-ease-drf.vercel.app/api/bookings/available/${getQueryParam(
    "hotel_id"
  )}/${getQueryParam("room_id")}`;

  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.booked_dates || data.booked_dates.length === 0) {
        console.log("No booked dates found.");
        return;
      }

      let disabledDates = [];

      data.booked_dates.forEach((range) => {
        let startDate = new Date(range.start_date);
        let endDate = new Date(range.end_date);

        while (startDate <= endDate) {
          let formattedDate = startDate.toISOString().split("T")[0];
          if (!disabledDates.includes(formattedDate)) {
            disabledDates.push(formattedDate);
          }
          startDate.setDate(startDate.getDate() + 1);
        }
      });

      // console.log("Blocked Dates:", disabledDates);

      flatpickr("#checkin-date, #checkout-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: disabledDates,
        disableMobile: true,
        onDayCreate: function (dObj, dStr, fp, dayElem) {
          const date = dayElem.dateObj.toISOString().split("T")[0];

          if (disabledDates.includes(date)) {
            dayElem.style.backgroundColor = "#ff4d4d";
            dayElem.style.color = "white";
            dayElem.style.opacity = "0.8";
            dayElem.style.borderRadius = "50%";
            dayElem.classList.add("booked-date");
          }
        },
      });
    })
    .catch((error) => console.error("Error fetching dates:", error));
}

function validateForm() {
  const checkin = document.getElementById("checkin-date").value;
  const checkout = document.getElementById("checkout-date").value;
  const guests = document.getElementById("guests").value;
  const reserveBtn = document.getElementById("reserveBtn");
  reserveBtn.disabled = !(checkin && checkout && guests);
}

function redirectCheckout() {
  const checkin = document.getElementById("checkin-date").value;
  const checkout = document.getElementById("checkout-date").value;
  const guests = document.getElementById("guests").value;
  if (!checkin || !checkout || !guests) {
    alert(
      "Please select Check-in Date, Check-out Date, and Guests before proceeding!"
    );
    return;
  }
  window.location.href = `checkout.html?hotel=${getQueryParam(
    "hotel_id"
  )}&room=${getQueryParam(
    "room_id"
  )}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`;
}

// =================

function generateAmenitiesIcons(amenities) {
  const icons = {
    "Air Conditioning": "fas fa-snowflake",
    TV: "fas fa-tv",
    "Mini Fridge": "fas fa-ice-cream",
    "Wi-Fi": "fas fa-wifi",
    "Room Service": "fas fa-concierge-bell",
    Gym: "fas fa-dumbbell",
    "Swimming Pool": "fas fa-swimmer",
    Parking: "fas fa-parking",
    Elevator: "fas fa-elevator",
    "Pet Friendly": "fas fa-paw",
    Restaurant: "fas fa-utensils",
    Bar: "fas fa-cocktail",
    Laundry: "fas fa-tshirt",
    Safe: "fas fa-lock",
    Balcony: "fas fa-window-maximize",
    "Coffee Maker": "fas fa-coffee",
    Washer: "fas fa-washer",
    Heater: "fas fa-thermometer-half",
    "Smoke Free": "fas fa-smoking-ban",
    Kitchen: "fas fa-utensils",
    "Work Desk": "fas fa-laptop",
    "Smart TV": "fas fa-tv-alt",
    Jacuzzi: "fas fa-hot-tub",
    Fireplace: "fas fa-fire",
    "Mini Bar": "fas fa-wine-glass-alt",
    Kitchenette: "fas fa-concierge-bell",
    "Free WiFi": "fas fa-wifi",
    "Private Balcony": "fas fa-window-maximize",
  };

  return amenities
    .split(",")
    .map((item) => {
      let trimmedItem = item.trim();
      let iconClass = icons[trimmedItem] || "fas fa-check-circle";
      return `<li><i class="${iconClass}" style="font-size: 24px; color: #C8B292;"></i> ${trimmedItem}</li>`;
    })
    .join("");
}
