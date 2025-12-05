import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from './BackButton';
import './Auth.css';
import './DealerLogin.css';

const DealerLogin = () => {
  const { signIn, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as dealer
  useEffect(() => {
    if (user) {
      // Check if user is a dealer and redirect
      const userType = user.user_metadata?.user_type || 'farmer';
      if (userType === 'dealer') {
        // Use window.location for a fresh page load
        window.location.href = '/dealer/dashboard';
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Sign in with Supabase Auth
      const result = await signIn(formData.email, formData.password, 'dealer');
      
      if (result.success) {
        // Use window.location for a fresh page load instead of navigate
        // This ensures the dashboard opens in a completely fresh state
        window.location.href = '/dealer/dashboard';
      } else {
        // Handle specific error messages
        let errorMessage = result.error || 'Invalid email or password';
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email before logging in';
        }
        setError(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="dealer-login-page">
      <div className="dealer-login-container">
        <BackButton className="orange" />
        <div className="dealer-login-header">
          <h1>🏪 Dealer Portal</h1>
          <p className="dealer-login-subtitle">BIOFACTOR - One Health Center</p>
        </div>
        
        <div className="dealer-login-card">
          <div className="dealer-login-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          
          <h2>Dealer Login</h2>
          <p className="dealer-login-description">Access your dealer dashboard to manage products, sales, and orders</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="dealer-login-form">
            <div className="form-group">
              <label htmlFor="email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Dealer Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dealer@example.com"
                required
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            
            <button 
              type="submit" 
              className="dealer-login-button" 
              disabled={loading}
            >
              {loading ? (
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
          
          <div className="dealer-login-footer">
            <p>Don't have an account? <Link to="/signup">Sign up as Dealer</Link></p>
            <div className="dealer-login-links">
              <Link to="/login/farmer">Farmer Login</Link>
              <span>|</span>
              <Link to="/login/admin">Admin Login</Link>
              <span>|</span>
              <Link to="/">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerLogin;

