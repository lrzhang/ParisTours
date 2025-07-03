export interface StripeSession {
  id: string;
  url: string;
  payment_status: 'unpaid' | 'paid' | 'no_payment_required';
  client_reference_id: string;
  customer_email: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
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