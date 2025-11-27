import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) {
    return (
      <div className="product-detail">
        <div className="not-found">
          <h2>Product not found</h2>
          <Link to="/products">Back to Products</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product.price * quantity;
  const discountPrice = quantity >= 5 ? totalPrice * 0.95 : totalPrice; // 5% discount for 5+ items
  const finalPrice = quantity >= 10 ? totalPrice * 0.90 : discountPrice; // 10% discount for 10+ items

  return (
    <div className="product-detail">
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="detail-content">
          <div className="product-image-large">
            <div className="image-wrapper">
              <img src={product.image || '/images/placeholder.jpg'} alt={product.name} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#999;">No Image</div>'; }} />
            </div>
          </div>

          <div className="product-details">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-description">{product.description}</p>

            <div className="price-section">
              <div className="price-info">
                <span className="product-price">₹{product.price}</span>
                <span className="price-per-unit">per unit</span>
              </div>
              {product.inStock && (
                <span className="stock-badge">
                  ✓ In Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Range Display */}
            <div className="total-price-section">
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Unit Price:</span>
                  <span>₹{product.price}</span>
                </div>
                <div className="price-row">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                {quantity >= 5 && (
                  <div className="price-row discount">
                    <span>Discount ({quantity >= 10 ? '10%' : '5%'}):</span>
                    <span>-₹{(totalPrice - finalPrice).toFixed(2)}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span>Total Price:</span>
                  <span>₹{finalPrice.toFixed(2)}</span>
                </div>
              </div>
              {quantity >= 5 && (
                <div className="discount-info">
                  🎉 You saved ₹{(totalPrice - finalPrice).toFixed(2)}!
                </div>
              )}
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="success-message">
                ✓ Added to cart successfully!
              </div>
            )}

            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="product-features">
              <h3>Product Features</h3>
              <ul>
                <li>100% Certified Organic</li>
                <li>Premium Quality</li>
                <li>Natural & Fresh</li>
                <li>Eco-Friendly Packaging</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="related-products">
          <h2>You Might Also Like</h2>
          <div className="related-grid">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 3)
              .map(relatedProduct => (
                <Link
                  to={`/products/${relatedProduct.id}`}
                  key={relatedProduct.id}
                  className="related-card"
                >
                  <div className="related-image">
                    <img src={relatedProduct.image || '/images/placeholder.jpg'} alt={relatedProduct.name} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <h4>{relatedProduct.name}</h4>
                  <p className="related-price">₹{relatedProduct.price}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
