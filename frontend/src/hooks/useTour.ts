import { useApi } from './useApi';
import { tourService } from '../services/tourService';
import type { Tour, TourAvailability } from '../types/tour';

// Hook for fetching featured tour
export const useFeaturedTour = () => {
  return useApi<Tour>(tourService.getFeaturedTour);
};

// Hook for fetching all tours
export const useAllTours = () => {
  return useApi<Tour[]>(tourService.getAllTours);
};

// Hook for fetching tour by ID
export const useTourById = () => {
  return useApi<Tour>(tourService.getTourById);
};

// Hook for fetching tour availability
export const useTourAvailability = () => {
  return useApi<TourAvailability>(tourService.getTourAvailability);
};

// Hook for fetching time slots
export const useTimeSlots = () => {
  return useApi<Array<{ time: string; maxCapacity: number }>>(tourService.getTimeSlots);
}; 