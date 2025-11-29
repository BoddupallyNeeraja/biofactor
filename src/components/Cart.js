import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [imageErrors, setImageErrors] = useState({});

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item from cart?')) {
      removeFromCart(productId);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>Your Cart</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const discount = cartTotal >= 5000 ? cartTotal * 0.1 : cartTotal >= 3000 ? cartTotal * 0.05 : 0;
  const finalTotal = cartTotal - discount;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h1>
          {cartItems.length > 0 && (
            <button onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }} className="clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {imageErrors[item.id] ? (
                    <div className="placeholder-img">No Image</div>
                  ) : (
                    <img 
                      src={item.image || '/images/placeholder.jpg'} 
                      alt={item.name}
                      onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                    />
                  )}
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">₹{item.price} per unit</p>
                </div>

                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <p className="item-total-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount ({cartTotal >= 5000 ? '10%' : '5%'}):</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="savings-info">
                🎉 You saved ₹{discount.toFixed(2)}!
              </div>
            )}

            <button 
              className="checkout-btn"
              onClick={() => alert('Checkout functionality will be implemented soon!')}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping-link">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

