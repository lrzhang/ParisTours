import { apiClient } from './api';
import type { Tour, TourAvailability } from '../types/tour';

export const tourService = {
  // Get featured tour for landing page
  getFeaturedTour: async (): Promise<Tour> => {
    const response = await apiClient.get<{ tour: Tour }>('/tours/featured');
    if (response.status === 'success' && response.data) {
      return response.data.tour;
    }
    throw new Error('Failed to fetch featured tour');
  },

  // Get all tours
  getAllTours: async (): Promise<Tour[]> => {
    const response = await apiClient.get<{ data: Tour[] }>('/tours');
    if (response.status === 'success' && response.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch tours');
  },

  // Get tour by ID
  getTourById: async (id: string): Promise<Tour> => {
    const response = await apiClient.get<{ data: Tour }>(`/tours/${id}`);
    if (response.status === 'success' && response.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch tour');
  },

  // Get tour availability for a specific date
  getTourAvailability: async (tourId: string, date: string): Promise<TourAvailability> => {
    const response = await apiClient.get<TourAvailability>(`/bookings/availability/${tourId}`, { date });
    if (response.status === 'success' && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch tour availability');
  },

  // Get available time slots for a tour on a specific date
  getTimeSlots: async (tourId: string, date: string): Promise<Array<{ time: string; maxCapacity: number }>> => {
    const response = await apiClient.get<{ timeSlots: Array<{ time: string; maxCapacity: number }> }>(`/bookings/time-slots/${tourId}/${date}`);
    if (response.status === 'success' && response.data) {
      return response.data.timeSlots;
    }
    throw new Error('Failed to fetch time slots');
  },
}; 