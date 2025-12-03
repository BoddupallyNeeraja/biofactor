import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import './Home.css';

const Home = () => {
  const [imageErrors, setImageErrors] = useState({});
  
  // Show featured products from different categories
  const featuredProducts = [
    products.find(p => p.category === 'BIOFERTILIZERS'),
    products.find(p => p.category === 'ORGANIC FERTILIZERS'),
    products.find(p => p.category === 'CHEMICAL FERTILIZERS'),
    products.find(p => p.category === 'WATERSOLUBLES'),
    products.find(p => p.category === 'SPECIAL PRODUCTS'),
    products.find(p => p.category === 'CIB PRODUCT')
  ].filter(Boolean);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">🌿 Welcome to One Health Center</h1>
          <p className="hero-subtitle">Your trusted source for premium agricultural products</p>
          <p className="hero-description">
            Discover our comprehensive range of biofertilizers, organic fertilizers, chemical fertilizers, 
            and specialty products. Quality solutions for enhanced crop yield and sustainable farming.
          </p>
          <Link to="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Biofertilizers</h3>
            <p>Natural and eco-friendly solutions for sustainable agriculture</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Water Solubles</h3>
            <p>High-quality water-soluble fertilizers for efficient nutrient delivery</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Premium Quality</h3>
            <p>Tested and proven formulations for enhanced crop yield</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Expert Support</h3>
            <p>Comprehensive solutions for all your agricultural needs</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="section-container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                <div className="product-image">
                  {imageErrors[product.id] ? (
                    <div className="image-placeholder">No Image</div>
                  ) : (
                    <img 
                      src={product.image || '/images/placeholder.jpg'} 
                      alt={product.name} 
                      onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))} 
                    />
                  )}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
              </Link>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/products" className="view-all-button">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


