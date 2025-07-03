import { BOOKING_ADVANCE_DAYS } from './constants';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

export const formatDisplayDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const isDateAvailable = (date: Date): boolean => {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + BOOKING_ADVANCE_DAYS);
  
  return date >= minDate;
};

export const getMinBookingDate = (): Date => {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + BOOKING_ADVANCE_DAYS);
  return minDate;
};

export const getMaxBookingDate = (): Date => {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 365); // Allow bookings up to 1 year in advance
  return maxDate;
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