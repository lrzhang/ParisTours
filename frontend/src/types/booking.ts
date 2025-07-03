export interface Booking {
  _id: string;
  tour: string | {
    _id: string;
    name: string;
  };
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  timeSlot: string;
  guests: number;
  price: number;
  paid: boolean;
  stripeSessionId?: string;
  createdAt: string;
}

export interface BookingFormData {
  tourId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  timeSlot: string;
  guests: number;
}

export interface BookingReservation {
  bookingId: string;
  booking: Booking;
}

export interface BookingConfirmation {
  booking: Booking;
  sessionId: string;
} 