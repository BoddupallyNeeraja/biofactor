import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ customPath, customLabel, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else {
      navigate(-1); // Go back in browser history
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className={`back-button ${className}`}
      aria-label="Go back"
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{customLabel || 'Back'}</span>
    </button>
  );
};

export default BackButton;

