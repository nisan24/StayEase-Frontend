// ====== Notyf ======
const notyf = new Notyf({
  duration: 3500,
  position: {
    x: "center",
    y: "top",
  },
  types: [
    {
      type: "info",
      background: "#FFFF00",
      icon: "⚠️ ",
    },
    {
      type: "success",
      background: "#4CAF50",
      icon: "✅",
    },
  ],
});

// ========================

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ========================

document.addEventListener("DOMContentLoaded", function () {
  booking_summary();
});

function booking_summary() {
  const bookingSummary = document.getElementById("booking-summary-container");
  bookingSummary.innerHTML = "";

  const info = {
    hotel_id: parseInt(getQueryParam("hotel")),
    room_id: parseInt(getQueryParam("room")),
    start_date: getQueryParam("checkin"),
    end_date: getQueryParam("checkout"),
    guests: parseInt(getQueryParam("guests")),
  };

  console.log("info: ", info);

  fetch("https://stay-ease-drf.vercel.app/api/bookings/calculate_checkout/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Data:", data);

      bookingSummary.innerHTML = `
        <div class="shadow-sm p-4 rounded bg-white">
          <div class="d-flex align-items-center mb-3">
            <img
                id="room-image"
                src="${data.room_image}"
                alt="Room Image"
                class="img-fluid rounded me-3"
                width="100"
            />
            <div>
              <h5 id="room-title" class="text-dark fw-bold">
                ${data.room_title}
              </h5>
              <p id="room-type" class="text-muted">
                ${data.room_type}
              </p>
              <p id="summary-rating" class="text-dark">
                <strong>Rating:</strong> ⭐ ${AverageRating_cal(data.room_reviews)}
              </p>
            </div>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <span><strong>Check-in:</strong></span>
            <span id="checkin-date">${data.start_date}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span><strong>Check-out:</strong></span>
            <span id="checkout-date">${data.end_date}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span><strong>Guests:</strong></span>
            <span id="num-guests">${data.guests}</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <span><strong>Price per night:</strong></span>
            <span id="price-per-night">$${data.price_per_night}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span><strong>Nights:</strong></span>
            <span id="num-nights">${data.total_nights}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span><strong>Subtotal:</strong> (${data.price_per_night} * ${data.total_nights})</span>
            <span id="subtotal">${data.total_price}</span>   
          </div>
          <hr/>
          <div class="d-flex justify-content-between">
            <span><strong>Cleaning Fee:</strong></span>
            <span>$50.00</span>
          </div>
          <div class="d-flex justify-content-between">
            <span><strong>Service Fee:</strong></span>
            <span>$120.40</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between text-danger fw-bold">
            <span>Total:</span>
            <span id="total-price">$${data.total_price + 50 + 120}</span>
          </div>
        </div>
      `;
    })
    .catch((error) => console.error("API Error: ", error));
}

// === Average Rating Calculation ===
function AverageRating_cal(reviews) {
  if (!reviews || reviews.length === 0) return "No Ratings Yet";
  const total_review_star = reviews.reduce((sum, r) => sum + r.rating, 0);
  return (total_review_star / reviews.length).toFixed(1);
}

// ========================

const room_booking = (event) => {
  event.preventDefault();

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  const bookingBtn = document.getElementById("bookingBtn");
  const loadingSpinner = document.getElementById("loading_spinner");


  if (!name || !email || !phone || !address) {
    notyf.error("Please fill in all the required fields!");
    return;
  }

  const booking_info = {
    hotel: parseInt(getQueryParam("hotel")),
    room: parseInt(getQueryParam("room")),
    start_date: getQueryParam("checkin"),
    end_date: getQueryParam("checkout"),
    guests: parseInt(getQueryParam("guests")),
    name: name,
    contact_number: phone,
    email: email,
    address: address,
  };
  // console.log("booking info: ", booking_info);

  const token = localStorage.getItem("token");
  // console.log("T- ", token);

  bookingBtn.disabled = true;
  loadingSpinner.style.display = "inline-block";

  fetch("https://stay-ease-drf.vercel.app/api/bookings/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking_info),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data:", data);
      console.log("Booking ID:", data.booking.id);
      notyf.success("Booking successfully!!");
      // alert("Booking successfully!!");
      BookingPayment(data.booking.id);
    })
    .catch((error) => console.error("Fetch Error:", error))
    .finally(() => {
      bookingBtn.disabled = false;
      loadingSpinner.style.display = "none";
    });
};

function BookingPayment(bookingID) {
  const token = localStorage.getItem("token");
  console.log("T- ", token);

  fetch("https://stay-ease-drf.vercel.app/api/payment/create/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ booking_id: bookingID }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Payment initiation failed.");
      }
      return res.json();
    })
    .then((data) => {
      if (data.status === "success") {
        console.log("data: ", data);
        // console.log("Payment URL:", data.payment_url);
        window.location.href = data.payment_url;
      } else {
        // alert("Payment initiation failed: " + data.message);
        notyf.error("payment failed: " + data.message);
      }
    })
    .catch((error) => {
      // console.error("Error payment:", error);
      // alert("Something wrong payment.");
      notyf.error("Something wrong payment.");
    });
}
