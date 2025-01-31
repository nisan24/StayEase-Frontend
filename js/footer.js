document.addEventListener("DOMContentLoaded", function () {
  const footer = document.getElementById("footer");
  footer.innerHTML = `
    <footer style="background-color: #212121; color: #e0e0e0; text-align: center; padding: 20px 0; margin-top: 60px;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
        <div style="margin-bottom: 20px;">
          <p>&copy; 2025 StayEase. All rights reserved.</p>
        </div>
        <div style="margin-bottom: 20px;">
          <a href="#" style="color: #e0e0e0; margin: 0 15px; font-size: 30px; text-decoration: none;" aria-label="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" style="color: #e0e0e0; margin: 0 15px; font-size: 30px; text-decoration: none;" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" style="color: #e0e0e0; margin: 0 15px; font-size: 30px; text-decoration: none;" aria-label="Twitter">
            <i class="fab fa-twitter"></i>
          </a>
        </div>
        <div>
          <p style="font-size: 14px; margin-top: 10px;">Follow us for the latest updates and promotions.</p>
        </div>
      </div>
    </footer>
  `;
});
