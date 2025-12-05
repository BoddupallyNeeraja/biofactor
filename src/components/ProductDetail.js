import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import BackButton from './BackButton';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [relatedImageErrors, setRelatedImageErrors] = useState({});

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail">
        <div className="not-found">
          <BackButton />
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
        <BackButton />

        <div className="detail-content">
          <div className="product-image-large">
            <div className="image-wrapper">
              {imageError ? (
                <div className="image-placeholder">No Image</div>
              ) : (
                <img 
                  src={product.image || '/images/placeholder.jpg'} 
                  alt={product.name} 
                  onError={() => setImageError(true)} 
                />
              )}
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
              .map(relatedProduct => {
                const handleRelatedProductClick = (e) => {
                  // Scroll to top immediately when clicking related product
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant' // Use instant for immediate scroll, then smooth scroll happens on route change
                  });
                };

                return (
                  <Link
                    to={`/products/${relatedProduct.id}`}
                    key={relatedProduct.id}
                    className="related-card"
                    onClick={handleRelatedProductClick}
                  >
                  <div className="related-image">
                    {relatedImageErrors[relatedProduct.id] ? (
                      <div className="image-placeholder-small">No Image</div>
                    ) : (
                      <img 
                        src={relatedProduct.image || '/images/placeholder.jpg'} 
                        alt={relatedProduct.name} 
                        onError={() => setRelatedImageErrors(prev => ({ ...prev, [relatedProduct.id]: true }))} 
                      />
                    )}
                  </div>
                  <h4>{relatedProduct.name}</h4>
                  <p className="related-price">₹{relatedProduct.price}</p>
                  <span className="view-details-text">View Details →</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
