import { useApi } from './useApi';
import { tourService } from '../services/tourService';
import type { Tour, TimeSlot } from '../types/tour';

/**
 * Hook for fetching all tours
 */
export const useTours = () => {
  return useApi<Tour[]>(tourService.getAllTours);
};

/**
 * Hook for fetching a single tour by ID
 */
export const useTourById = () => {
  return useApi<Tour>(tourService.getTourById);
};

/**
 * Hook for fetching featured tour
 */
export const useFeaturedTour = () => {
  return useApi<Tour>(tourService.getFeaturedTour);
};

/**
 * Hook for fetching tour availability
 */
export const useTourAvailability = () => {
  return useApi<{ availability: TimeSlot[] }>(tourService.getTourAvailability);
};

/**
 * Hook for fetching time slots for a tour
 */
export const useTimeSlots = () => {
  return useApi<Array<{ time: string; maxCapacity: number }>>(tourService.getTimeSlots);
};