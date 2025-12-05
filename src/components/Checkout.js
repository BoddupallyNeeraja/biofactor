import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import BackButton from './BackButton';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'cash'
  });

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.user_metadata?.name || ''
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate, authLoading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return false;
    }
    if (!formData.state.trim()) {
      setError('Please enter your state');
      return false;
    }
    if (!formData.zipCode.trim()) {
      setError('Please enter your zip code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const cartTotal = getCartTotal();
      const discount = cartTotal >= 5000 ? cartTotal * 0.1 : cartTotal >= 3000 ? cartTotal * 0.05 : 0;
      const finalTotal = cartTotal - discount;

      // Create order in Supabase
      const orderData = {
        user_id: user?.id || null,
        order_items: cartItems,
        subtotal: cartTotal,
        discount: discount,
        total: finalTotal,
        shipping_address: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        payment_method: formData.paymentMethod,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Clear cart after successful order
      await clearCart();

      // Navigate to order success page with order ID
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading || cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const discount = cartTotal >= 5000 ? cartTotal * 0.1 : cartTotal >= 3000 ? cartTotal * 0.05 : 0;
  const finalTotal = cartTotal - discount;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <BackButton customPath="/cart" customLabel="Back to Cart" />
        <div className="checkout-header">
          <Link to="/cart" className="back-link">← Back to Cart</Link>
          <h1>Checkout</h1>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Shipping Information */}
              <section className="form-section">
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="10-digit phone number"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Street address"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      placeholder="Zip Code"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Country"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <span>Credit/Debit Card (Coming Soon)</span>
                  </label>
                </div>
              </section>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order - ₹${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <div className="order-item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Discount ({cartTotal >= 5000 ? '10%' : '5%'}):</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="total-row shipping">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>

                <div className="total-row final-total">
                  <span>Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

