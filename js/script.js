function hotel_Show() {
  const HotelContainer = document.getElementById("hotel-cart-container");

  HotelContainer.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  fetch("https://stayease-drf.onrender.com/api/hotels/list/")
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.length === 0) {
        HotelContainer.innerHTML =
          "<h3 class='text-center text-muted'>No Hotels Found!</h3>";
        return;
      }

      HotelContainer.innerHTML = "";

      data.forEach((hotel) => {
        const hotelCard = `

        <div class="hotel-card">
          <div class="hotel-img" style="background: url('${
            hotel.image
          }') center/cover no-repeat;">
            <span class="price-tag" id="hotel-price"><strong>$${
              hotel.price_range_min
            } - $${hotel.price_range_max} / Night</strong></span>
          </div>
          <div class="hotel-info">
            <div class="hotel-name" id="hotel-name">${hotel.name}</div>
            <p id="hotel-address">${hotel.address}</p>
            <p>
              ⭐ <span class="text-dark">${AverageRating_cal(
                hotel.reviews
              )}</span>
                <small class="text-muted">
                  (<a href="#" class="text-decoration-underline text-dark fw-bold" data-bs-toggle="modal" 
                    data-bs-target="#reviewsModal" onclick="loadHotelReviews(${
                      hotel.id
                    })">
                    ${hotel.reviews.length} reviews</a>)
                </small>
            </p>
            <p class="hotel-description" id="hotel-description">
              ${hotel.description.split(" ").slice(0, 15).join(" ") + "..."}
            </p>
            <span class="read-more text-dark"><a href="details.html?id=${
              hotel.id
            }" class="text-dark">Read More</a></span>
          </div>
        </div>
        `;
        HotelContainer.innerHTML += hotelCard;
      });
    })
    .catch((error) => {
      console.error("API Error: ", error);
      HotelContainer.innerHTML =
        "<h3 class='text-center text-danger'>Error loading hotels. Please try again later.</h3>";
    });
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

// === Hotel Reviews ===
function loadHotelReviews(hotelId) {
  const reviewsContainer = document.getElementById("reviews-container");
  const reviewsCount = document.querySelector(".reviews-count");

  reviewsContainer.innerHTML = "";
  reviewsCount.innerHTML = "";

  reviewsContainer.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  fetch(`https://stayease-drf.onrender.com/api/reviews/hotel/${hotelId}/`)
    .then((res) => res.json())
    .then((data) => {
      const reviews = data.reviews;

      if (reviews && reviews.length > 0) {
        reviewsContainer.innerHTML = "";

        reviews.forEach((review) => {
          const createTimeUtc = new Date(review.create_time);
          const BD_time = createTimeUtc.toLocaleString("en-GB", {
            timeZone: "Asia/Dhaka",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          reviewsCount.innerHTML = `<strong>${reviews.length} Reviews</strong>`;

          reviewsContainer.innerHTML += `
            <div class="review-item border-bottom pb-3 mb-3 p-3 bg-light rounded">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center">
                  <img src="./img/profile.jpg" alt="${review.user}" class="rounded-circle" width="40" height="40" />
                  <div class="ml-2">
                    <strong class="ms-2">${review.user}</strong>
                  </div>
                  <small class="text-muted d-block ms-3 text-nowrap">${BD_time}</small>
                </div>
              </div>
              
              <div class="mb-2">
                <span class="text-warning">
                  ${review.rating}
                </span>
              </div>
              <p class="text-muted">${review.comment}</p>
            </div>
          `;
        });
      } else {
        reviewsContainer.innerHTML =
          "<p class='text-center text-muted'>No reviews yet!</p>";
      }
    })
    .catch((error) => {
      console.error("API Error: ", error);
      reviewsContainer.innerHTML =
        "<p class='text-center text-danger'>Failed to load reviews. Please try again later.</p>";
    });
}

document.addEventListener("DOMContentLoaded", hotel_Show);

// ==== *********
// iziToast.success({
//   title: "Success",
//   message: "Your operation was successful!",
//   position: "topCenter",
//   timeout: 5000,
// });

// iziToast.error({
//   title: "Error",
//   message: "Something went wrong!",
//   position: "topCenter",
//   timeout: 5000,
// });

//// ******
// const notyf = new Notyf({
//   duration: 3000,
//   position: {
//     x: "center",
//     y: "top",
//   },
// });

// notyf.success("Operation successful!");
// notyf.error("Something went wrong!");
// ==

// ===== ***********
// const Toast = Swal.mixin({
//   toast: true,
//   position: "top",
//   showConfirmButton: false,
//   timer: 4000,
//   timerProgressBar: true,
//   didOpen: (toast) => {
//     toast.addEventListener("mouseenter", Swal.stopTimer);
//     toast.addEventListener("mouseleave", Swal.resumeTimer);
//   },
// });

// Toast.fire({
//   icon: "success",
//   title: "Signed in successfully",
// });
