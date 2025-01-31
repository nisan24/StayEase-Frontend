// Display hotel details
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

// Render available rooms
function displayRooms(rooms) {
  const roomsContainer = document.getElementById("hotel-rooms-list");
  rooms.forEach((room) => {
    const roomCard = document.createElement("div");
    roomCard.classList.add("col-md-4", "room-card");

    roomCard.innerHTML = `
      <img src="${room.image}" alt="${room.name}">
      <div class="room-info">
        <h4>${room.name}</h4>
        <p>${room.description}</p>
        <p class="price">$${room.price} per night</p>
      </div>
    `;
    roomsContainer.appendChild(roomCard);
  });
}

// Example hotel data
const hotelData = {
  name: "Sea View Hotel",
  address: "123 Beachside Avenue",
  city: "Cox's Bazar",
  country: "Bangladesh",
  description:
    "A luxury resort located by the beach, offering breathtaking ocean views.",
  amenities: "Free WiFi, Swimming Pool, Spa, Beach Access, Breakfast Included",
  price_range_min: "100.00",
  price_range_max: "500.00",
  image: "http://127.0.0.1:8000/media/hotels/image/sonargaon_pic.jpg",
};

const roomsData = [
  {
    name: "Ocean View Room",
    description: "A beautiful room with an ocean view.",
    price: "150",
    image: "https://via.placeholder.com/300",
  },
  {
    name: "Deluxe Room",
    description: "Spacious and luxurious room with a king-sized bed.",
    price: "200",
    image: "https://via.placeholder.com/300",
  },
  {
    name: "Standard Room",
    description: "Cozy room with a queen-sized bed.",
    price: "120",
    image: "https://via.placeholder.com/300",
  },
];

// Display the hotel details and rooms
displayHotel(hotelData);
displayRooms(roomsData);
