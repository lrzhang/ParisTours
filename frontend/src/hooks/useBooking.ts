import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import type { Booking, BookingFormData, BookingReservation } from '../types/booking';

// Hook for creating a booking
export const useCreateBooking = () => {
  return useApi<BookingReservation>(bookingService.reserveBooking);
};

// Hook for getting booking by ID
export const useGetBooking = (id: string) => {
  return useApi<Booking>(() => bookingService.getBookingById(id));
};

// Hook for verifying payment
export const useVerifyPayment = () => {
  return useApi<Booking>(bookingService.verifyPayment);
};

// Hook for confirming booking
export const useConfirmBooking = () => {
  return useApi<Booking>(bookingService.confirmBooking);
};

// Hook for handling full booking flow
export const useBookingFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const startBookingFlow = useCallback(async (bookingData: BookingFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Reserve booking
      const reservation = await bookingService.reserveBooking(bookingData);
      
      // Step 2: Create checkout session
      const session = await paymentService.createCheckoutSession(reservation.bookingId);
      
      // Step 3: Redirect to Stripe
      await paymentService.redirectToCheckout(session.id);
      
      return reservation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start booking flow';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async (paymentIntentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await paymentService.confirmPayment(paymentIntentId);
      if (result.success && result.booking) {
        setBooking(result.booking);
        return result.booking;
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (sessionId: string): Promise<Booking> => {
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
  }, []);

  const confirmBooking = useCallback(async (sessionId: string): Promise<Booking> => {
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
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    booking,
    startBookingFlow,
    confirmPayment,
    verifyPayment,
    confirmBooking,
    resetBooking,
  };
};

 