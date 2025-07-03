import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Booking, BookingFormData } from '../types/booking';
import type { Tour } from '../types/tour';

interface BookingState {
  // Current booking flow state
  currentBooking: Booking | null;
  selectedTour: Tour | null;
  bookingForm: Partial<BookingFormData>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentBooking: (booking: Booking | null) => void;
  setSelectedTour: (tour: Tour | null) => void;
  updateBookingForm: (data: Partial<BookingFormData>) => void;
  clearBookingForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentBooking: null,
  selectedTour: null,
  bookingForm: {},
  isLoading: false,
  error: null,
};

export const useBookingStore = create<BookingState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setCurrentBooking: (booking) => set({ currentBooking: booking }),
        
        setSelectedTour: (tour) => set({ selectedTour: tour }),
        
        updateBookingForm: (data) => 
          set((state) => ({
            bookingForm: { ...state.bookingForm, ...data }
          })),
        
        clearBookingForm: () => set({ bookingForm: {} }),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        reset: () => set(initialState),
      }),
      {
        name: 'booking-storage',
        partialize: (state) => ({
          currentBooking: state.currentBooking,
          bookingForm: state.bookingForm,
        }),
      }
    ),
    {
      name: 'booking-store',
    }
  )
); 