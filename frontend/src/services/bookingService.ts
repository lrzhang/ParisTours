import { apiClient } from './api';
import type { Booking, BookingFormData, BookingReservation } from '../types/booking';

export const bookingService = {
  // Reserve a booking temporarily
  reserveBooking: async (bookingData: BookingFormData): Promise<BookingReservation> => {
    const response = await apiClient.post<{ booking: Booking }>('/bookings/reserve', bookingData);
    if (response.status === 'success' && response.data) {
      return {
        bookingId: response.data.booking._id,
        booking: response.data.booking,
      };
    }
    throw new Error('Failed to reserve booking');
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<{ data: Booking }>(`/bookings/${id}`);
    if (response.status === 'success' && response.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch booking');
  },

  // Verify payment status
  verifyPayment: async (sessionId: string): Promise<Booking> => {
    const response = await apiClient.get<{ booking: Booking  }>(`/bookings/verify?session_id=${sessionId}`);
    if (response.status === 'success' && response.data) {
      return response.data.booking;
    }
    throw new Error('Failed to verify payment');
  },

  // Confirm booking after payment
  confirmBooking: async (sessionId: string): Promise<Booking> => {
    const response = await apiClient.post<{ data: { booking: Booking } }>('/bookings/confirm', { sessionId });
    if (response.status === 'success' && response.data) {
      return response.data.data.booking;
    }
    throw new Error('Failed to confirm booking');
  },
}; 