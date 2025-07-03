import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
  showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onClose,
  showIcon = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '⚠️';
    }
  };

  return (
    <div className={`error-message error-message--${type}`}>
      <div className="error-message__content">
        {showIcon && (
          <span className="error-message__icon">{getIcon()}</span>
        )}
        <p className="error-message__text">{message}</p>
      </div>
      {onClose && (
        <button 
          className="error-message__close"
          onClick={onClose}
          aria-label="Close error message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 