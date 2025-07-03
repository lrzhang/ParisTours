// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || (() => {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
  return '';
})();

// Date Configuration
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';

// Booking Configuration
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 25;
export const BOOKING_ADVANCE_DAYS = 1; // Minimum days in advance for booking

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  INVALID_DATE: 'Please select a valid date.',
  INVALID_GUESTS: 'Please enter a valid number of guests.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_SUCCESS: 'Booking confirmed successfully!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  BOOK: '/book',
  PAYMENT: '/payment',
} as const; 