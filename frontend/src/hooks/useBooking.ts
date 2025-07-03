import { useState } from 'react';
import { useApi } from './useApi';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import type { Booking, BookingFormData, BookingReservation } from '../types/booking';
import type { StripeSession, PaymentResult } from '../types/payment';

// Hook for reserving a booking
export const useReserveBooking = () => {
  return useApi<BookingReservation>(bookingService.reserveBooking);
};

// Hook for getting booking by ID
export const useGetBooking = () => {
  return useApi<Booking>(bookingService.getBookingById);
};

// Hook for verifying payment
export const useVerifyPayment = () => {
  return useApi<Booking>(bookingService.verifyPayment);
};

// Hook for confirming booking
export const useConfirmBooking = () => {
  return useApi<Booking>(bookingService.confirmBooking);
};

// Hook for creating checkout session
export const useCreateCheckoutSession = () => {
  return useApi<StripeSession>((bookingId: string) => paymentService.createCheckoutSession(bookingId));
};

// Combined hook for the complete booking flow
export const useBookingFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const startBookingFlow = async (bookingData: BookingFormData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Reserve the booking
      const reservation = await bookingService.reserveBooking(bookingData);
      setBooking(reservation.booking);
      
      // Step 2: Create Stripe checkout session
      const session = await paymentService.createCheckoutSession(reservation.booking._id);
      
      // Step 3: Redirect to Stripe checkout
      await paymentService.redirectToCheckout(session.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await paymentService.confirmPayment(paymentIntentId);
      
      if (result.success && result.booking) {
        setBooking(result.booking);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment confirmation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (sessionId: string, bookingId?: string): Promise<Booking | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const booking = await paymentService.handlePaymentSuccess(sessionId, bookingId);
      setBooking(booking);
      return booking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment success';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (sessionId: string): Promise<Booking> => {
    setLoading(true);
    setError(null);
    
    try {
      const booking = await bookingService.verifyPayment(sessionId);
      setBooking(booking);
      return booking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (sessionId: string): Promise<Booking> => {
    setLoading(true);
    setError(null);
    
    try {
      const booking = await bookingService.confirmBooking(sessionId);
      setBooking(booking);
      return booking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setBooking(null);
    setError(null);
  };

  return {
    loading,
    error,
    booking,
    startBookingFlow,
    confirmPayment,
    handlePaymentSuccess,
    verifyPayment,
    confirmBooking,
    resetBooking,
  };
};

 