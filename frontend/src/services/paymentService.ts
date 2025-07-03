import { apiClient } from './api';
import { stripePromise, getSuccessUrl, getCancelUrl } from '../utils/stripe';
import type { BookingFormData } from '../types/booking';
import type { PaymentIntent, CheckoutSession } from '../types/payment';

export const paymentService = {
  // Create Stripe checkout session
  createCheckoutSession: async (bookingId: string): Promise<CheckoutSession> => {
    const response = await apiClient.post<CheckoutSession>('/bookings/checkout-session', {
      bookingId,
    });
    
    if (response.status === 'success') {
      // Backend returns session directly at root level, not under data
      return (response as any).session;
    }
    throw new Error('Failed to create checkout session');
  },

  // Redirect to Stripe checkout
  redirectToCheckout: async (sessionId: string): Promise<void> => {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message || 'Failed to redirect to checkout');
    }
  },

  // Create payment intent for embedded checkout
  createPaymentIntent: async (bookingData: BookingFormData): Promise<PaymentIntent> => {
    const response = await apiClient.post<{ paymentIntent: PaymentIntent }>('/bookings/payment-intent', bookingData);
    
    if (response.status === 'success' && response.data) {
      return response.data.paymentIntent;
    }
    throw new Error('Failed to create payment intent');
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string): Promise<{ success: boolean; booking?: any }> => {
    const response = await apiClient.post<{ booking: any }>('/bookings/confirm-payment', {
      paymentIntentId,
    });
    
    if (response.status === 'success') {
      return { success: true, booking: response.data?.booking };
    }
    return { success: false };
  },

  // Get payment status
  getPaymentStatus: async (sessionId: string): Promise<{ status: string; booking?: any }> => {
    const response = await apiClient.get<{ status: string; booking?: any }>(`/bookings/payment-status/${sessionId}`);
    
    if (response.status === 'success' && response.data) {
      return response.data;
    }
    throw new Error('Failed to get payment status');
  },

  // Handle successful payment
  handlePaymentSuccess: async (sessionId: string, bookingId?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (sessionId) params.append('session_id', sessionId);
    if (bookingId) params.append('booking_id', bookingId);

    const response = await apiClient.get<{ booking: any }>(`/bookings/payment-success?${params.toString()}`);
    
    if (response.status === 'success' && response.data) {
      return response.data.booking;
    }
    throw new Error('Failed to handle payment success');
  },
}; 