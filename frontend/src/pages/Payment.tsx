import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useBookingFlow } from '../hooks/useBooking';
import { ROUTES } from '../utils/constants';
import { formatPrice } from '../utils/priceUtils';
import { formatDisplayDate } from '../utils/dateUtils';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Booking } from '../types/booking';
import './Payment.css';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, loading, error } = useBookingFlow();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [processed, setProcessed] = useState(false);

  const processPayment = useCallback(async (sessionId: string) => {
    if (processed) return; // Prevent multiple calls
    
    setProcessed(true);
    try {
      const booking = await verifyPayment(sessionId);
      setBooking(booking);
    } catch (err) {
      console.error('Payment processing error:', err);
      setProcessed(false); // Allow retry on error
    }
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId && !processed && !booking) {
      processPayment(sessionId);
    }
  }, [searchParams, processPayment, processed, booking]);

  // if (loading) {
  //   return (
  //     <div className="payment-page">
  //       <div className="container">
  //         <div className="payment-status">
  //           <LoadingSpinner message="Processing your payment..." />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-status">
            <ErrorMessage message={error} />
            <button 
              onClick={() => navigate(ROUTES.HOME)} 
              className="btn btn--primary"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-status">
            <ErrorMessage message="No booking found" />
            <button 
              onClick={() => navigate(ROUTES.HOME)} 
              className="btn btn--primary"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-success">
          <div className="payment-success__icon">
            <span className="success-checkmark">✓</span>
          </div>
          
          <h1 className="payment-success__title">Payment Successful!</h1>
          <p className="payment-success__message">
            Thank you for your booking. Your tour has been confirmed and you'll receive a confirmation email shortly.
          </p>

          <div className="booking-summary">
            <h2 className="booking-summary__title">Booking Details</h2>
            
            <div className="booking-summary__content">
              <div className="booking-summary__item">
                <strong>Booking ID:</strong> {booking._id}
              </div>
              <div className="booking-summary__item">
                <strong>Tour:</strong> {typeof booking.tour === 'object' ? booking.tour.name : 'Tour'}
              </div>
              <div className="booking-summary__item">
                <strong>Date:</strong> {formatDisplayDate(new Date(booking.date))}
              </div>
              <div className="booking-summary__item">
                <strong>Time:</strong> {booking.timeSlot}
              </div>
              <div className="booking-summary__item">
                <strong>Guests:</strong> {booking.guests}
              </div>
              <div className="booking-summary__item">
                <strong>Guest Name:</strong> {booking.guestName}
              </div>
              <div className="booking-summary__item">
                <strong>Email:</strong> {booking.guestEmail}
              </div>
              <div className="booking-summary__item">
                <strong>Total Paid:</strong> {formatPrice(booking.price * booking.guests)}
              </div>
            </div>
          </div>

          <div className="payment-success__actions">
            <button 
              onClick={() => navigate(ROUTES.HOME)} 
              className="btn btn--primary"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-cancel">
          <div className="payment-cancel__icon">
            <span className="cancel-x">✕</span>
          </div>
          
          <h1 className="payment-cancel__title">Payment Cancelled</h1>
          <p className="payment-cancel__message">
            Your payment was cancelled. Your booking has not been confirmed.
          </p>

          <div className="payment-cancel__actions">
            <button 
              onClick={() => navigate(ROUTES.HOME)} 
              className="btn btn--primary"
            >
              Return Home
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="btn btn--secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payment: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Check the URL path instead of query parameters
  if (pathname === '/payment/success') {
    return <PaymentSuccess />;
  }

  if (pathname === '/payment/cancel') {
    return <PaymentCancel />;
  }

  // Default payment page (for future embedded checkout)
  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-form">
          <h1>Complete Your Payment</h1>
          <p>AWEFAWEFAWEF..</p>
        </div>
      </div>
    </div>
  );
};

export default Payment; 