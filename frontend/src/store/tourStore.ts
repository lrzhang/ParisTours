import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Tour, TimeSlot } from '../types/tour';

interface TourState {
  // Tour data
  tours: Tour[];
  featuredTour: Tour | null;
  currentTour: Tour | null;
  
  // Availability data
  availability: TimeSlot[];
  timeSlots: Array<{ time: string; maxCapacity: number }>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTours: (tours: Tour[]) => void;
  setFeaturedTour: (tour: Tour | null) => void;
  setCurrentTour: (tour: Tour | null) => void;
  setAvailability: (availability: TimeSlot[]) => void;
  setTimeSlots: (timeSlots: Array<{ time: string; maxCapacity: number }>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  tours: [],
  featuredTour: null,
  currentTour: null,
  availability: [],
  timeSlots: [],
  isLoading: false,
  error: null,
};

export const useTourStore = create<TourState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setTours: (tours) => set({ tours }),
      
      setFeaturedTour: (tour) => set({ featuredTour: tour }),
      
      setCurrentTour: (tour) => set({ currentTour: tour }),
      
      setAvailability: (availability) => set({ availability }),
      
      setTimeSlots: (timeSlots) => set({ timeSlots }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'tour-store',
    }
  )
); 