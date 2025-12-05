import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <BackButton />
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About BIOFACTOR</h1>
          <p className="hero-subtitle">Transforming Agriculture Through Innovation</p>
          <p className="brand-hierarchy">
            <Link to="/products" className="sub-brand-badge clickable-sub-brand">One Health Center</Link> - A dedicated health-focused vertical within the BIOFACTOR platform
          </p>
        </section>

        {/* Company Overview */}
        <section className="about-section">
          <div className="section-content">
            <h2>Our Platform</h2>
            <p>
              <strong>BIOFACTOR</strong> is a comprehensive agricultural solutions platform dedicated to providing premium 
              biofertilizers, organic fertilizers, and specialized agricultural products. As the main platform, 
              BIOFACTOR serves as the foundation for multiple specialized verticals, each focused on specific aspects 
              of agricultural and health solutions.
            </p>
            <h2>One Health Center - Our Health Vertical</h2>
            <p>
              <Link to="/products"><strong>One Health Center</strong></Link> is a dedicated sub-brand within the BIOFACTOR ecosystem, specifically 
              focused on health-related agricultural products and services. As part of the BIOFACTOR family, One Health Center 
              brings specialized expertise in health-focused solutions while leveraging the platform's extensive infrastructure, 
              quality standards, and commitment to sustainable farming practices.
            </p>
            <p>
              With years of experience in the agricultural sector, we understand the challenges farmers face 
              and strive to provide effective, reliable, and affordable products that enhance crop quality 
              and productivity while maintaining soil health and promoting overall agricultural wellness.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-section mission-vision">
          <div className="mission-vision-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide farmers with high-quality, sustainable agricultural solutions that enhance 
                crop productivity, improve soil health, and promote environmentally responsible farming practices.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To become India's most trusted brand in agricultural inputs, recognized for innovation, 
                quality, and our commitment to farmer prosperity and sustainable agriculture.
              </p>
            </div>
          </div>
        </section>

        {/* Products Overview */}
        <section className="about-section">
          <h2>Our Products</h2>
          <div className="products-overview">
            <div className="product-category-card">
              <h3>🌱 Biofertilizers</h3>
              <p>
                Our range of biofertilizers includes nitrogen-fixing, phosphorus-solubilizing, and 
                potassium-enhancing formulations that naturally improve soil fertility and plant nutrition.
              </p>
            </div>
            <div className="product-category-card">
              <h3>🌿 Organic Fertilizers</h3>
              <p>
                Premium organic fertilizers like POSHAK and BELOM series designed for different growth 
                stages, providing complete nutrition for healthy plant development.
              </p>
            </div>
            <div className="product-category-card">
              <h3>🧪 Chemical Fertilizers</h3>
              <p>
                High-quality chemical fertilizers including HIGH-K, KING-K, and specialized formulations 
                for enhanced fruit quality, color, and taste.
              </p>
            </div>
            <div className="product-category-card">
              <h3>💧 Water Solubles</h3>
              <p>
                Complete range of water-soluble fertilizers with balanced NPK ratios for efficient nutrient 
                delivery through drip irrigation and foliar application.
              </p>
            </div>
            <div className="product-category-card">
              <h3>🛡️ Special Products</h3>
              <p>
                Advanced solutions like BSL4 Agri Bio Security Liquid and NUTRITON + VIRNIX for comprehensive 
                plant protection against pests and diseases.
              </p>
            </div>
            <div className="product-category-card">
              <h3>🌾 CIB Products</h3>
              <p>
                Natural and organic pest control solutions including NATIVENEEM and NEEM SANJEEVANI for 
                sustainable crop protection.
              </p>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="about-section technology">
          <h2>Our Technology</h2>
          <div className="tech-content">
            <div className="tech-badge">MAMSP TECHNOLOGY</div>
            <p>
              We utilize patented MAMSP (Microbial and Molecular Soil Process) technology to create 
              innovative formulations that work in harmony with nature. Our products are designed by 
              nature and delivered by us, ensuring maximum efficacy and environmental compatibility.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="about-section values">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <span className="value-icon">✓</span>
              <h4>Quality First</h4>
              <p>We never compromise on the quality of our products</p>
            </div>
            <div className="value-item">
              <span className="value-icon">🌱</span>
              <h4>Sustainability</h4>
              <p>Committed to eco-friendly and sustainable practices</p>
            </div>
            <div className="value-item">
              <span className="value-icon">🤝</span>
              <h4>Farmer Focus</h4>
              <p>Dedicated to farmer success and prosperity</p>
            </div>
            <div className="value-item">
              <span className="value-icon">🔬</span>
              <h4>Innovation</h4>
              <p>Continuously developing better solutions</p>
            </div>
            <div className="value-item">
              <span className="value-icon">💚</span>
              <h4>Soil Health</h4>
              <p>Promoting healthy soil for future generations</p>
            </div>
            <div className="value-item">
              <span className="value-icon">🎯</span>
              <h4>Reliability</h4>
              <p>Trusted by farmers across India</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="about-section contact-section">
          <h2>Get in Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Phone</h4>
                <p>+91 9298011119</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <h4>Email</h4>
                <p>admin@onehealthcenter.in</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <div>
                <h4>Website</h4>
                <p>www.onehealthcenter.in</p>
              </div>
            </div>
          </div>
          <div className="company-info">
            <p><strong>Biofac Inputs Private Limited</strong></p>
            <p>AGRI | AQUA | POULTRY | RUMINANTS</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

