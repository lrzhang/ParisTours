import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#55c57a',
  message = 'Loading...'
}) => {
  const sizeClass = `spinner--${size}`;
  
  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClass}`} style={{ borderTopColor: color }}>
        <div className="spinner-inner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 