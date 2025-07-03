export interface StripeSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
  currency: string;
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentConfirmation {
  sessionId: string;
  paymentStatus: 'paid' | 'failed' | 'pending';
  booking?: {
    _id: string;
    tour: {
      name: string;
    };
    guestName: string;
    guestEmail: string;
    date: string;
    timeSlot: string;
    guests: number;
    price: number;
  };
}

export interface CheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  amount_total: number;
  currency: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  bookingId: string;
  guestEmail: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  booking?: any;
}

export interface PaymentStatus {
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  booking?: any;
  error?: string;
} 