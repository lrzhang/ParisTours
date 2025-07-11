//import { BOOKING_ADVANCE_DAYS } from './constants';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Format a date for display (e.g., "Monday, January 15, 2024")
 */
export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time for display (e.g., "09:00 AM")
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get minimum booking date (tomorrow)
 */
export const getMinBookingDate = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

/**
 * Get maximum booking date (6 months from now)
 */
export const getMaxBookingDate = (): Date => {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  return maxDate;
};

/**
 * Check if a date is available for booking
 */
export const isDateAvailable = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  // Disable Sundays (0) and past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dayOfWeek !== 0 && date >= today;
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}; 