import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🌿 BIOFACTOR</h3>
          <p className="sub-brand-label">
            <Link to="/products" className="sub-brand clickable-sub-brand">One Health Center</Link> - A BIOFACTOR Brand
          </p>
          <p>Your trusted source for organic products. Quality you can trust, nature you can believe in.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@onehealthcenter.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 BIOFACTOR. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


