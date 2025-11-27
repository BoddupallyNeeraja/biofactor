import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details from backend
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order. Your order has been received and is being processed.
        </p>
        
        {order && (
          <div className="order-details">
            <div className="order-info-box">
              <h2>Order Details</h2>
              <div className="info-row">
                <span>Order ID:</span>
                <span className="order-id">#{order.orderId || orderId}</span>
              </div>
              <div className="info-row">
                <span>Order Date:</span>
                <span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Total Amount:</span>
                <span className="total-amount">₹{order.totals?.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="info-row">
                <span>Payment Method:</span>
                <span>{order.payment?.method?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>

            <div className="order-info-box">
              <h2>Shipping Address</h2>
              <p>
                {order.customerInfo?.firstName} {order.customerInfo?.lastName}<br />
                {order.customerInfo?.address}<br />
                {order.customerInfo?.city}, {order.customerInfo?.state} - {order.customerInfo?.pincode}<br />
                Phone: {order.customerInfo?.phone}
              </p>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/" className="home-btn">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

