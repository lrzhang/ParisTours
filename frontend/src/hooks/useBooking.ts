import { useApi } from './useApi';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import type { Booking, BookingFormData, BookingReservation } from '../types/booking';
import type { StripeSession } from '../types/payment';

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
  return useApi<StripeSession>(paymentService.createCheckoutSession);
};

// Combined hook for the complete booking flow
export const useBookingFlow = () => {
  const reserveBooking = useReserveBooking();
  const createCheckoutSession = useCreateCheckoutSession();
  const verifyPayment = useVerifyPayment();
  const confirmBooking = useConfirmBooking();

  const startBookingFlow = async (bookingData: BookingFormData) => {
    try {
      // Step 1: Reserve the booking
      const reservation = await reserveBooking.execute(bookingData);
      
      // Step 2: Create checkout session
      const session = await createCheckoutSession.execute(reservation.bookingId);
      
      // Step 3: Redirect to payment
      paymentService.redirectToCheckout(session.url);
      
      return { reservation, session };
    } catch (error) {
      console.error('Booking flow error:', error);
      throw error;
    }
  };

  return {
    startBookingFlow,
    reserveBooking,
    createCheckoutSession,
    verifyPayment,
    confirmBooking,
    loading: reserveBooking.loading || createCheckoutSession.loading,
    error: reserveBooking.error || createCheckoutSession.error,
  };
}; 