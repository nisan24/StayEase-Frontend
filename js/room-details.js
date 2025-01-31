function get_Hotel_id() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("hotel_id");
}

function get_Room_id() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("room_id");
}

document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = `https://stayease-drf.onrender.com/api/hotels/rooms/?hotel_id=${get_Hotel_id()}&room_id=${get_Room_id()}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log("Room Data:", data);
      displayRoomDetails(data[0]);
      initializeDatePickers();
      dateDisableShow();
    })
    .catch((error) => {
      console.error("API Error: ", error);
    });
});

function displayRoomDetails(data) {
  if (!data) {
    console.error("No room data found");
    return;
  }

  const roomContainer = document.getElementById("room-details-container");

  const calculatePrice = () => {
    const checkin = document.getElementById("checkin-date").value;
    const checkout = document.getElementById("checkout-date").value;
    const priceElement = document.getElementById("price-section");
    if (checkin && checkout) {
      const nights = Math.ceil(
        (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = nights * parseFloat(data.price_per_night);
      priceElement.innerHTML = `$${data.price_per_night} / night`;
      document.getElementById("total-price").innerHTML = `
        <span>$${data.price_per_night} x ${nights} nights: $${totalPrice}</span>
        <span>Cleaning Fee: $38</span>
        <span>Service Fee: $65</span>
        <hr />
        <span><strong>Total: $${totalPrice + 38 + 65}</strong></span>
      `;
    } else {
      priceElement.innerHTML = "Add dates for prices";
      document.getElementById("total-price").innerHTML = "";
    }
  };

  roomContainer.innerHTML = `
    <div class="container">
      <h2>${data.hotel_name} - ${data.room_type}</h2>
    </div>
    <div class="container cl">
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

    <div class="container">
      <div class="info">
        <h3>${data.title || "N/A"}</h3>
        <h4>${data.beds} beds &#183; ${data.bathrooms} private bathrooms</h4>
        <strong>⭐ ${AverageRating_cal(data.reviews)} - ${
    data.reviews.length
  } reviews</strong>
      </div>

      <!-- booking -->
      <div class="cart border border-3">
        <h3 id="price-section">Add dates for prices</h3>
        <div>
          <div class="d-flex">
            <div class="input-group me-md-2 mb-2 mb-md-0">
              <span class="input-group-text bg-primary text-white">
                <i class="bi bi-calendar-event"></i>
              </span>
              <input
                type="text"
                class="form-control datepicker"
                id="checkin-date"
                placeholder="Check-in"
                readonly
              />
                <span class="input-group-text clear-icon" id="clear-checkin">
                <i class="bi bi-x-circle"></i>
                </span>
            </div>
            <div class="input-group">
              <span class="input-group-text bg-primary text-white">
                <i class="bi bi-calendar-check"></i>
              </span>
              <input
                type="text"
                class="form-control datepicker"
                id="checkout-date"
                placeholder="Check-out"
                readonly
              />
                <span class="input-group-text clear-icon" id="clear-checkout">
                <i class="bi bi-x-circle"></i>
                </span>
            </div>
          </div>

            <div class="dropdown">
              <label for="guests">Guests:</label>
              <select id="guests" class="form-select">
                ${Array.from({ length: data.guests }, (_, i) => i + 1)
                  .map(
                    (num) => `<option value="${num}">${num} Guest(s)</option>`
                  )
                  .join("")}
              </select>
            </div>
        </div>

        <button class="mt-3 btn btn-primary">Reserve</button>

        <div class="cart-details" id="total-price">

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
}

function initializeDatePickers() {
  const checkinPicker = document.getElementById("checkin-date");
  const checkoutPicker = document.getElementById("checkout-date");

  if (checkinPicker && checkoutPicker) {
    flatpickr(checkinPicker, {
      dateFormat: "Y-m-d",
      minDate: "today",
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Check-in date selected: ", dateStr);
      },
    });

    flatpickr(checkoutPicker, {
      dateFormat: "Y-m-d",
      minDate: "today",
      onChange: function (selectedDates, dateStr, instance) {
        console.log("Check-out date selected: ", dateStr);
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

// ======================

function dateDisableShow() {
  const apiURL =
    "https://stayease-drf.onrender.com/api/bookings/available/2/1/";

  let disabledDates = [];

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      const bookedDates = data.booked_dates;
      const disabledDatesSet = new Set();

      bookedDates.forEach((range) => {
        const startDate = new Date(range.start_date + "T00:00:00");
        const endDate = new Date(range.end_date + "T00:00:00");

        for (
          let currentDate = new Date(startDate);
          currentDate <= endDate;
          currentDate.setDate(currentDate.getDate() + 1)
        ) {
          disabledDatesSet.add(currentDate.toISOString().split("T")[0]);
        }
      });

      disabledDates = Array.from(disabledDatesSet);
      console.log("Disabled Dates (Unique):", disabledDates);

      console.log("Disabled Dates (Asia/Dhaka):", disabledDates);

      flatpickr("#checkin-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: disabledDates,
        disableMobile: true,
        onDayCreate: function (dObj, dStr, fp, dayElem) {
          const date = dayElem.dateObj.toISOString().split("T")[0];
          if (disabledDates.includes(date)) {
            dayElem.innerHTML += `<span class="cross">✖</span>`;
            dayElem.classList.add("booked-date");
            dayElem.setAttribute("aria-disabled", "true");
          }
        },
      });

      flatpickr("#checkout-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: disabledDates,
        disableMobile: true,
        onDayCreate: function (dObj, dStr, fp, dayElem) {
          const date = dayElem.dateObj.toISOString().split("T")[0];
          if (disabledDates.includes(date)) {
            dayElem.innerHTML += `<span class="cross">✖</span>`;
            dayElem.classList.add("booked-date");
            dayElem.setAttribute("aria-disabled", "true");
          }
        },
      });
    });
}
