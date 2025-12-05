import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { supabase } from '../utils/supabaseClient';
import BackButton from './BackButton';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { addToCart, getCartItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [imageErrors, setImageErrors] = useState({});
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login/farmer');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Farmer';

  return (
    <div className="farmer-dashboard">
      <div className="dashboard-header">
        <BackButton customPath="/" customLabel="Back to Home" />
        <div className="header-content">
          <h1>🌾 Farmer Dashboard</h1>
          <p className="sub-title">One Health Center - Product Portal</p>
        </div>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {userName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="products-section">
          <div className="products-filters">
            <div className="filter-section">
              <h3>Search Products</h3>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-section">
              <h3>Categories</h3>
              <div className="category-list">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="products-grid-container">
            <h2 className="section-title">Available Products ({filteredProducts.length})</h2>
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found. Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
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
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">₹{product.price}</p>
                      {product.inStock && (
                        <span className="in-stock-badge">In Stock</span>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleQuickAdd(e, product)}
                    >
                      {addedItems[product.id] ? '✓ Added!' : '+ Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

