import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            Online Blood Donation Portal connects donors with recipients efficiently,
            saving lives through organized blood management.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/donors">Donors</a></li>
            <li><a href="/requests">Requests</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: ankityadav02032003@gmail.com</p>
          <p>Phone: 9508731982</p>
          <p>Address: LPU , jalandher Punjab , India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Blood Donation Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
