import { apiClient } from './api';
import type { StripeSession } from '../types/payment';

export const paymentService = {
  // Create Stripe checkout session
  createCheckoutSession: async (bookingId: string): Promise<StripeSession> => {
    const response = await apiClient.post<{ session: StripeSession }>('/bookings/checkout-session', { bookingId });
    if (response.status === 'success' && response.data) {
      return response.data.session;
    }
    throw new Error('Failed to create checkout session');
  },

  // Redirect to Stripe checkout
  redirectToCheckout: (sessionUrl: string): void => {
    window.location.href = sessionUrl;
  },

  // Get payment status from URL params
  getPaymentStatusFromUrl: (): { success: boolean; cancelled: boolean; sessionId: string | null } => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success') === 'true';
    const cancelled = urlParams.get('cancelled') === 'true';
    const sessionId = urlParams.get('session_id');
    
    return { success, cancelled, sessionId };
  },
}; 