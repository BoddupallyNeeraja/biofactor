import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const cartTotal = getCartTotal();
  const discount = cartTotal >= 5000 ? cartTotal * 0.1 : cartTotal >= 3000 ? cartTotal * 0.05 : 0;
  const finalTotal = cartTotal - discount;
  const shipping = finalTotal > 2000 ? 0 : 100;
  const grandTotal = finalTotal + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (!/^[0-9]{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        payment: {
          method: formData.paymentMethod,
          amount: grandTotal,
          ...(formData.paymentMethod === 'card' && {
            cardNumber: formData.cardNumber.slice(-4), // Only store last 4 digits
            cardName: formData.cardName
          })
        },
        totals: {
          subtotal: cartTotal,
          discount,
          shipping,
          total: grandTotal
        }
      };

      // Call backend API to create order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // Clear cart
        clearCart();
        // Navigate to order success page
        navigate(`/order-success/${result.orderId}`);
      } else {
        alert(result.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <div className="empty-cart-message">
            <p>Your cart is empty. Please add items to proceed.</p>
            <button onClick={() => navigate('/products')} className="shop-now-btn">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            {/* Shipping Information */}
            <div className="checkout-section">
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="checkout-section">
              <h2>Payment Information</h2>
              
              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              {formData.paymentMethod === 'card' && (
                <>
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.expiryDate ? 'error' : ''}
                      />
                      {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        maxLength="4"
                        className={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                    </div>
                  </div>
                </>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="form-group">
                  <label>UPI ID *</label>
                  <input
                    type="text"
                    name="upiId"
                    placeholder="yourname@upi"
                    className={errors.upiId ? 'error' : ''}
                  />
                  {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                </div>
              )}

              {formData.paymentMethod === 'cod' && (
                <div className="cod-info">
                  <p>💰 You will pay ₹{grandTotal.toFixed(2)} when your order is delivered.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-sidebar">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
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

              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order - ₹${grandTotal.toFixed(2)}`}
            </button>

            <Link to="/cart" className="back-to-cart">
              ← Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

