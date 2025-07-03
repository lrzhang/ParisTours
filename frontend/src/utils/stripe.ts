import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from './constants';

// Initialize Stripe
export const stripePromise = STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.reject(new Error('Stripe publishable key is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.'));

// Stripe configuration
export const STRIPE_CONFIG = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#55c57a',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#e74c3c',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
  clientSecret: '',
};

// Stripe payment element options
export const PAYMENT_ELEMENT_OPTIONS = {
  layout: 'tabs' as const,
  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
};

// Redirect URLs
export const getSuccessUrl = (bookingId: string) => {
  return `${window.location.origin}/payment/success?booking_id=${bookingId}`;
};

export const getCancelUrl = () => {
  return `${window.location.origin}/payment/cancel`;
}; 