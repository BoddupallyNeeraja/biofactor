import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import BackButton from './BackButton';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let query = supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        // If user is logged in, also verify it's their order
        if (user) {
          query = query.eq('user_id', user.id);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, user]);

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="loading-state">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="error-state">
            <h2>Order Not Found</h2>
            <p>{error || 'The order you are looking for does not exist.'}</p>
            <Link to="/" className="home-btn">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <BackButton customPath="/products" customLabel="Continue Shopping" />
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order. We've received your order and will process it shortly.
        </p>

        <div className="order-details-card">
          <h2>Order Details</h2>
          
          <div className="detail-row">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">#{order.id}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Order Date:</span>
            <span className="detail-value">
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`detail-value status ${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value">
              {order.payment_method === 'cash' ? 'Cash on Delivery' : 'Card Payment'}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value amount">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="shipping-details-card">
          <h2>Shipping Address</h2>
          <div className="address-details">
            <p><strong>{order.shipping_address.fullName}</strong></p>
            <p>{order.shipping_address.address}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
            <p>{order.shipping_address.country}</p>
            <p>Phone: {order.shipping_address.phone}</p>
            <p>Email: {order.shipping_address.email}</p>
          </div>
        </div>

        <div className="order-items-card">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.order_items.map((item, index) => (
              <div key={index} className="order-item-row">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity} × ₹{item.price}</p>
                </div>
                <div className="item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="total-row discount">
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row final">
              <span>Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
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

