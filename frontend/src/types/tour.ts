export interface Tour {
  _id: string;
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  createdAt: string;
  startDates: string[];
  startLocation: {
    type: 'Point';
    coordinates: number[];
    address: string;
    description: string;
  };
  locations: Array<{
    type: 'Point';
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  }>;
  timeSlots: Array<{
    time: string;
    maxCapacity: number;
  }>;
  defaultTimeSlots: string[];
}

export interface TimeSlot {
  time: string;
  available: number;
  maxCapacity: number;
  bookedGuests: number;
}

export interface TourAvailability {
  date: string;
  availability: TimeSlot[];
} 