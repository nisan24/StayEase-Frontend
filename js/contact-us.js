document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const all_data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  fetch("https://stay-ease-drf.vercel.app/api/contacts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(all_data),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Message sent successfully!");

      document.getElementById("contactForm").reset();
    })
    .catch((error) => {
      alert("Error submitting the form.");
      console.error(error);
    });
});
