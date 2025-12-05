import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BackButton from './BackButton';
import './Auth.css';

const FarmerLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(formData.email, formData.password, 'farmer');
      
      if (result.success) {
        navigate('/farmer/dashboard');
      } else {
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
    <div className="auth-container">
      <BackButton className="light" />
      <div className="auth-card" style={{ borderTop: '4px solid #4caf50' }}>
        <h2 style={{ color: '#4caf50' }}>🌾 Farmer Login</h2>
        <p className="auth-subtitle">Access your products portal</p>
        <p className="auth-brand-note">Login to <span className="sub-brand">One Health Center</span></p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Farmer Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="farmer@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' 
            }}
          >
            {loading ? 'Logging in...' : 'Login as Farmer'}
          </button>
        </form>
        
        <p className="auth-footer">
          <Link to="/login/dealer">Dealer Login</Link> | <Link to="/login/admin">Admin Login</Link>
        </p>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default FarmerLogin;

