import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import BackButton from './BackButton';
import './Products.css';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [imageErrors, setImageErrors] = useState({});

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
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      <div className="page-header">
        <BackButton />
        <h1>Our Organic Products</h1>
        <p>Discover our wide range of premium organic products</p>
      </div>

      <div className="products-container">
        <div className="products-sidebar">
          <div className="filter-section">
            <h3>Search Products</h3>
            <input
              type="text"
              placeholder="Search..."
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

        <div className="products-content">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found. Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
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
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price}</p>
                    {product.inStock && (
                      <span className="in-stock-badge">In Stock</span>
                    )}
                  </div>
                  <button
                    className="quick-add-btn"
                    onClick={(e) => handleQuickAdd(e, product)}
                    title="Add to Cart"
                  >
                    {addedItems[product.id] ? '✓ Added!' : '+ Add to Cart'}
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;


