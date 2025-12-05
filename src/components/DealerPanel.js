import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import BackButton from './BackButton';
import './DealerPanel.css';
import './Auth.css';

const DealerPanel = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is a dealer
  const [isDealer, setIsDealer] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  
  // Check user type when user changes
  useEffect(() => {
    const checkDealerStatus = async () => {
      if (!user) {
        setIsDealer(false);
        setShowLogin(true);
        return;
      }

      // First check user_metadata
      const userTypeFromMeta = user.user_metadata?.user_type;
      if (userTypeFromMeta === 'dealer') {
        setIsDealer(true);
        setShowLogin(false);
        return;
      }

      // If not in metadata, check profiles table
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (!error && data?.user_type === 'dealer') {
          setIsDealer(true);
          setShowLogin(false);
        } else {
          setIsDealer(false);
          setShowLogin(true);
        }
      } catch (error) {
        // If can't check profile, assume not dealer
        setIsDealer(false);
        setShowLogin(true);
      }
    };

    checkDealerStatus();
  }, [user]);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    if (!loginData.email || !loginData.password) {
      setLoginError('Please fill in all fields');
      setLoginLoading(false);
      return;
    }

    console.log('Attempting dealer login with:', loginData.email);
    
    try {
      const result = await signIn(loginData.email, loginData.password, 'dealer');
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, redirecting to dashboard...');
        // Use window.location for a fresh page load
        window.location.href = '/dealer/dashboard';
      } else {
        let errorMessage = result.error || 'Invalid email or password';
        console.error('Login failed:', errorMessage);
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email before logging in';
        }
        setLoginError(errorMessage);
        setLoginLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('An unexpected error occurred. Please try again.');
      setLoginLoading(false);
    }
  };

  return (
    <div className="dealer-panel-page">
      <div className="dealer-panel-container">
        <BackButton className="orange" customPath="/" customLabel="Back to Home" />
        {/* Hero Section */}
        <div className="dealer-panel-hero">
          <div className="dealer-panel-hero-content">
            <div className="dealer-panel-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h1>🏪 Dashboard</h1>
            <p className="dealer-panel-subtitle">BIOFACTOR - One Health Center</p>
            <p className="dealer-panel-description">
              Dealer Dashboard - Your dedicated portal for managing products, tracking sales, and growing your business
            </p>
          </div>
        </div>

        {/* Login Section - At Top */}
        {showLogin && (
          <div className="dealer-login-section">
            <div className="dealer-login-card-inline">
              <h2>🔐 Dealer Login</h2>
              <p className="login-subtitle">Login to access your dealer dashboard</p>
              
              {loginError && <div className="error-message">{loginError}</div>}
              
              <form onSubmit={handleLoginSubmit} className="dealer-login-form-inline">
                <div className="form-group">
                  <label htmlFor="login-email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Dealer Email
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="dealer@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="login-password">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="dealer-login-button-inline" 
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <span className="spinner"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <span>Login to Dashboard</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </form>
              
              <div className="login-footer-inline">
                <p>Don't have an account? <Link to="/signup">Sign up as Dealer</Link></p>
                <div className="login-links-inline">
                  <Link to="/login/farmer">Farmer Login</Link>
                  <span>|</span>
                  <Link to="/login/admin">Admin Login</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="dealer-panel-info">
          <div className="info-card">
            <div className="info-icon">🔐</div>
            <h3>Secure Access</h3>
            <p>
              This section opens the dedicated Dashboard, where the dealer can securely access their dashboard, 
              view sold products, manage listings, and track sales. Only authenticated dealers can enter this area.
            </p>
            <button 
              className="info-button"
              onClick={() => setActiveInfo(activeInfo === 'secure' ? null : 'secure')}
            >
              {activeInfo === 'secure' ? 'Hide Details' : 'Learn More'}
            </button>
            {activeInfo === 'secure' && (
              <div className="info-details">
                <h4>Security Features:</h4>
                <ul>
                  <li>✅ Industry-standard encryption for all data</li>
                  <li>✅ Two-factor authentication support</li>
                  <li>✅ Secure session management</li>
                  <li>✅ Role-based access control</li>
                  <li>✅ Regular security audits and updates</li>
                  <li>✅ Data backup and recovery systems</li>
                </ul>
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>View Sold Products</h3>
            <p>
              Track all your product sales with detailed analytics. See which products are selling best, 
              revenue generated, and customer purchase patterns.
            </p>
            <button 
              className="info-button"
              onClick={() => setActiveInfo(activeInfo === 'sold' ? null : 'sold')}
            >
              {activeInfo === 'sold' ? 'Hide Details' : 'Learn More'}
            </button>
            {activeInfo === 'sold' && (
              <div className="info-details">
                <h4>Sales Analytics Features:</h4>
                <ul>
                  <li>📈 Real-time sales dashboard</li>
                  <li>📊 Product performance metrics</li>
                  <li>💰 Revenue tracking and reports</li>
                  <li>📉 Sales trends and forecasting</li>
                  <li>👥 Customer purchase patterns</li>
                  <li>🏆 Best-selling products ranking</li>
                  <li>📅 Daily, weekly, monthly reports</li>
                  <li>💹 Profit margin analysis</li>
                </ul>
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-icon">📦</div>
            <h3>Manage Listings</h3>
            <p>
              Easily add, edit, and remove product listings. Update prices, descriptions, images, and 
              inventory status in real-time.
            </p>
            <button 
              className="info-button"
              onClick={() => setActiveInfo(activeInfo === 'listings' ? null : 'listings')}
            >
              {activeInfo === 'listings' ? 'Hide Details' : 'Learn More'}
            </button>
            {activeInfo === 'listings' && (
              <div className="info-details">
                <h4>Product Management Features:</h4>
                <ul>
                  <li>➕ Add new products easily</li>
                  <li>✏️ Edit product details anytime</li>
                  <li>🗑️ Remove outdated listings</li>
                  <li>💰 Update prices instantly</li>
                  <li>📝 Manage product descriptions</li>
                  <li>🖼️ Upload and update product images</li>
                  <li>📦 Track inventory levels</li>
                  <li>🏷️ Organize by categories</li>
                  <li>📊 Bulk product operations</li>
                </ul>
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="info-icon">💰</div>
            <h3>Track Sales</h3>
            <p>
              Monitor your sales performance with comprehensive reports. View total revenue, order history, 
              and sales trends to make informed business decisions.
            </p>
            <button 
              className="info-button"
              onClick={() => setActiveInfo(activeInfo === 'sales' ? null : 'sales')}
            >
              {activeInfo === 'sales' ? 'Hide Details' : 'Learn More'}
            </button>
            {activeInfo === 'sales' && (
              <div className="info-details">
                <h4>Sales Tracking Features:</h4>
                <ul>
                  <li>📊 Comprehensive sales dashboard</li>
                  <li>💵 Total revenue tracking</li>
                  <li>📋 Complete order history</li>
                  <li>📈 Sales trend analysis</li>
                  <li>📅 Date range filtering</li>
                  <li>👤 Customer order details</li>
                  <li>📦 Order status management</li>
                  <li>💳 Payment method tracking</li>
                  <li>📧 Automated sales reports</li>
                  <li>🎯 Sales goal tracking</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="dealer-panel-features">
          <h2>What You Can Do</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <h4>Dashboard Overview</h4>
              <p>Get a comprehensive view of your business metrics at a glance</p>
              <button 
                className="feature-button"
                onClick={() => setActiveInfo(activeInfo === 'dashboard' ? null : 'dashboard')}
              >
                {activeInfo === 'dashboard' ? 'Hide Info' : 'View Details'}
              </button>
              {activeInfo === 'dashboard' && (
                <div className="feature-details">
                  <h5>Dashboard Features:</h5>
                  <ul>
                    <li>📊 Real-time sales statistics</li>
                    <li>💰 Total revenue display</li>
                    <li>📦 Order count and status</li>
                    <li>📈 Sales trends visualization</li>
                    <li>🎯 Quick action buttons</li>
                    <li>📱 Responsive design for all devices</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <h4>Product Management</h4>
              <p>Add, edit, and manage your product catalog with ease</p>
              <button 
                className="feature-button"
                onClick={() => setActiveInfo(activeInfo === 'products' ? null : 'products')}
              >
                {activeInfo === 'products' ? 'Hide Info' : 'View Details'}
              </button>
              {activeInfo === 'products' && (
                <div className="feature-details">
                  <h5>Product Management Features:</h5>
                  <ul>
                    <li>➕ Quick product addition</li>
                    <li>✏️ Easy editing interface</li>
                    <li>📸 Image upload support</li>
                    <li>🏷️ Category organization</li>
                    <li>💰 Price management</li>
                    <li>📝 Rich text descriptions</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <h4>Sales Analytics</h4>
              <p>View detailed sales reports and product performance metrics</p>
              <button 
                className="feature-button"
                onClick={() => setActiveInfo(activeInfo === 'analytics' ? null : 'analytics')}
              >
                {activeInfo === 'analytics' ? 'Hide Info' : 'View Details'}
              </button>
              {activeInfo === 'analytics' && (
                <div className="feature-details">
                  <h5>Analytics Features:</h5>
                  <ul>
                    <li>📊 Interactive charts and graphs</li>
                    <li>📈 Sales trend analysis</li>
                    <li>🏆 Top performing products</li>
                    <li>📅 Time period filtering</li>
                    <li>💹 Revenue breakdown</li>
                    <li>📉 Performance comparisons</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="feature-item">
              <div className="feature-number">04</div>
              <h4>Order Tracking</h4>
              <p>Monitor all orders placed by farmers and track their status</p>
              <button 
                className="feature-button"
                onClick={() => setActiveInfo(activeInfo === 'orders' ? null : 'orders')}
              >
                {activeInfo === 'orders' ? 'Hide Info' : 'View Details'}
              </button>
              {activeInfo === 'orders' && (
                <div className="feature-details">
                  <h5>Order Tracking Features:</h5>
                  <ul>
                    <li>📋 Complete order list</li>
                    <li>🔍 Search and filter orders</li>
                    <li>📊 Order status updates</li>
                    <li>👤 Customer information</li>
                    <li>📦 Item details per order</li>
                    <li>💳 Payment tracking</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="feature-item">
              <div className="feature-number">05</div>
              <h4>Revenue Reports</h4>
              <p>Analyze your revenue streams and identify growth opportunities</p>
              <button 
                className="feature-button"
                onClick={() => setActiveInfo(activeInfo === 'revenue' ? null : 'revenue')}
              >
                {activeInfo === 'revenue' ? 'Hide Info' : 'View Details'}
              </button>
              {activeInfo === 'revenue' && (
                <div className="feature-details">
                  <h5>Revenue Report Features:</h5>
                  <ul>
                    <li>💰 Total revenue summary</li>
                    <li>📊 Revenue by product</li>
                    <li>📅 Daily/weekly/monthly reports</li>
                    <li>📈 Growth trends</li>
                    <li>💹 Profit margin analysis</li>
                    <li>📧 Exportable reports</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="feature-item">
              <div className="feature-number">06</div>
              <h4>Customer Insights</h4>
              <p>Understand your customer base and their purchasing behavior</p>
              <button 
                className="feature-button"
                onClick={() => setActiveInfo(activeInfo === 'customers' ? null : 'customers')}
              >
                {activeInfo === 'customers' ? 'Hide Info' : 'View Details'}
              </button>
              {activeInfo === 'customers' && (
                <div className="feature-details">
                  <h5>Customer Insight Features:</h5>
                  <ul>
                    <li>👥 Customer demographics</li>
                    <li>🛒 Purchase history</li>
                    <li>⭐ Customer preferences</li>
                    <li>📊 Buying patterns</li>
                    <li>🎯 Customer segmentation</li>
                    <li>💬 Feedback and reviews</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {isDealer && (
          <div className="dealer-panel-cta">
            <div className="cta-content">
              <h2>Welcome Back, Dealer!</h2>
              <p>You're already logged in. Access your dashboard to continue managing your business.</p>
              <Link to="/dealer/dashboard" className="cta-button primary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="dealer-panel-security">
          <div className="security-icon">🛡️</div>
          <h3>Secure & Protected</h3>
          <p>
            Your dashboard is protected with industry-standard security measures. 
            Only authenticated dealers with valid credentials can access this area. 
            All your business data is encrypted and securely stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealerPanel;

