import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useTourById, useTourAvailability, useTimeSlots } from '../hooks/useTour';
import { useBookingFlow } from '../hooks/useBooking';
// import { ROUTES } from '../utils/constants';
import { formatPriceBreakdown } from '../utils/priceUtils';
import { formatDate, formatTime, getMinBookingDate, getMaxBookingDate } from '../utils/dateUtils';
import { ERROR_MESSAGES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import type { BookingFormData } from '../types/booking';
import type { TimeSlot } from '../types/tour';
import 'react-datepicker/dist/react-datepicker.css';
import './TourBooking.css';

const TourBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string; maxCapacity: number }>>([]);

  const { data: tour, loading: tourLoading, error: tourError, execute: fetchTour } = useTourById();
  const { data: availabilityData, execute: fetchAvailability } = useTourAvailability();
  const { data: timeSlotsData, execute: fetchTimeSlots } = useTimeSlots();
  const { startBookingFlow, loading: bookingLoading, error: bookingError } = useBookingFlow();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>();

  // Fetch tour data on component mount
  useEffect(() => {
    if (id) {
      fetchTour(id);
    }
  }, [id, fetchTour]);

  // Fetch time slots when tour is loaded
  useEffect(() => {
    if (tour && selectedDate) {
      fetchTimeSlots(tour._id, formatDate(selectedDate));
    }
  }, [tour, selectedDate, fetchTimeSlots]);

  // Fetch availability when date and time slots are available
  useEffect(() => {
    if (tour && selectedDate && timeSlotsData) {
      fetchAvailability(tour._id, formatDate(selectedDate));
    }
  }, [tour, selectedDate, timeSlotsData, fetchAvailability]);

  // Update availability when data is fetched
  useEffect(() => {
    if (availabilityData) {
      setAvailability(availabilityData.availability);
    }
  }, [availabilityData]);

  // Update time slots when data is fetched
  useEffect(() => {
    if (timeSlotsData) {
      setTimeSlots(timeSlotsData);
    }
  }, [timeSlotsData]);

  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTimeSlot(''); // Reset time slot when date changes
  };

  // Handle time slot selection
  const handleTimeSlotChange = (time: string) => {
    setSelectedTimeSlot(time);
  };

  // Handle number of guests change
  const handleGuestsChange = (guests: number) => {
    setNumberOfGuests(guests);
  };

  // Check if selected time slot is available
  const isTimeSlotAvailable = (time: string) => {
    const slot = availability.find(s => s.time === time);
    return slot && slot.available >= numberOfGuests;
  };

  // Calculate total price

  // Handle form submission
  const onSubmit = async (data: BookingFormData) => {
    if (!tour || !selectedDate || !selectedTimeSlot) {
      return;
    }

    const bookingData: BookingFormData = {
      tourId: tour._id,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      date: formatDate(selectedDate),
      timeSlot: selectedTimeSlot,
      guests: numberOfGuests,
    };

    try {
      await startBookingFlow(bookingData);
      // The booking flow will redirect to Stripe checkout
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  if (tourLoading) {
    return <LoadingSpinner message="Loading tour details..." />;
  }

  if (tourError) {
    return <ErrorMessage message={tourError} />;
  }

  if (!tour) {
    return <ErrorMessage message="Tour not found" />;
  }

  const priceBreakdown = formatPriceBreakdown(tour.price, numberOfGuests);

  return (
    <div className="tour-booking-page">
      <div className="container">
        {/* Tour Header */}
        <div className="tour-header">
          <div className="tour-header__image">
            <img src={`/img/tours/${tour.imageCover}`} alt={tour.name} />
          </div>
          <div className="tour-header__content">
            <h1 className="tour-header__title">{tour.name}</h1>
            <p className="tour-header__summary">{tour.summary}</p>
            <div className="tour-header__meta">
              <span className="tour-header__meta-item">
                <span className="tour-header__meta-icon">⏱️</span>
                {tour.duration} hours
              </span>
              <span className="tour-header__meta-item">
                <span className="tour-header__meta-icon">👥</span>
                Up to {tour.maxGroupSize} people
              </span>
              <span className="tour-header__meta-item">
                <span className="tour-header__meta-icon">⭐</span>
                {tour.ratingsAverage} rating
              </span>
            </div>
          </div>
        </div>

        <div className="booking-content">
          {/* Tour Details */}
          <div className="tour-details">
            <h2 className="section-title">Tour Details</h2>
            <p className="tour-details__description">{tour.description}</p>
            
            <div className="tour-details__info">
              <div className="tour-details__info-item">
                <strong>Difficulty:</strong> {tour.difficulty}
              </div>
              <div className="tour-details__info-item">
                <strong>Starting Point:</strong> {tour.startLocation.description}
              </div>
              <div className="tour-details__info-item">
                <strong>Stops:</strong> {tour.locations.length} locations
              </div>
            </div>

            {/* Tour Images */}
            <div className="tour-images">
              <h3>Tour Images</h3>
              <div className="tour-images__grid">
                {tour.images.map((image, index) => (
                  <div key={index} className="tour-images__item">
                    <img src={`/img/tours/${image}`} alt={`${tour.name} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form-container">
            <div className="booking-form-card">
              <h2 className="booking-form__title">Book Your Tour</h2>
              
              {bookingError && (
                <ErrorMessage message={bookingError} />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
                {/* Date Selection */}
                <div className="form-group">
                  <label className="form-label">Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={getMinBookingDate()}
                    maxDate={getMaxBookingDate()}
                    placeholderText="Choose your preferred date"
                    className="form-input"
                    dateFormat="MMMM dd, yyyy"
                    filterDate={(date) => {
                      // Only allow dates that are available
                      const dayOfWeek = date.getDay();
                      return dayOfWeek !== 0; // Disable Sundays
                    }}
                  />
                  {errors.date && <span className="form-error">{errors.date.message}</span>}
                </div>

                {/* Time Slot Selection */}
                {selectedDate && timeSlots.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Select Time</label>
                    <div className="time-slots">
                      {timeSlots.map((slot) => {
                        const isAvailable = isTimeSlotAvailable(slot.time);
                        const availableSpots = availability.find(s => s.time === slot.time)?.available || 0;
                        
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            className={`time-slot ${selectedTimeSlot === slot.time ? 'time-slot--selected' : ''} ${!isAvailable ? 'time-slot--unavailable' : ''}`}
                            onClick={() => handleTimeSlotChange(slot.time)}
                            disabled={!isAvailable}
                          >
                            <span className="time-slot__time">{formatTime(slot.time)}</span>
                            <span className="time-slot__availability">
                              {isAvailable ? `${availableSpots} spots left` : 'Full'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Number of Guests */}
                <div className="form-group">
                  <label className="form-label">Number of Guests</label>
                  <div className="guests-selector">
                    <button
                      type="button"
                      className="guests-selector__btn"
                      onClick={() => handleGuestsChange(Math.max(1, numberOfGuests - 1))}
                      disabled={numberOfGuests <= 1}
                    >
                      -
                    </button>
                    <span className="guests-selector__count">{numberOfGuests}</span>
                    <button
                      type="button"
                      className="guests-selector__btn"
                      onClick={() => handleGuestsChange(Math.min(tour.maxGroupSize, numberOfGuests + 1))}
                      disabled={numberOfGuests >= tour.maxGroupSize}
                    >
                      +
                    </button>
                  </div>
                  <small className="form-help">Maximum {tour.maxGroupSize} guests per tour</small>
                </div>

                {/* Guest Information */}
                <div className="form-group">
                  <label className="form-label" htmlFor="guestName">Full Name *</label>
                  <input
                    {...register('guestName', { required: ERROR_MESSAGES.REQUIRED_FIELD })}
                    type="text"
                    id="guestName"
                    className={`form-input ${errors.guestName ? 'form-input--error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.guestName && <span className="form-error">{errors.guestName.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="guestEmail">Email Address *</label>
                  <input
                    {...register('guestEmail', { 
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: ERROR_MESSAGES.INVALID_EMAIL
                      }
                    })}
                    type="email"
                    id="guestEmail"
                    className={`form-input ${errors.guestEmail ? 'form-input--error' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.guestEmail && <span className="form-error">{errors.guestEmail.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="guestPhone">Phone Number *</label>
                  <input
                    {...register('guestPhone', { required: ERROR_MESSAGES.REQUIRED_FIELD })}
                    type="tel"
                    id="guestPhone"
                    className={`form-input ${errors.guestPhone ? 'form-input--error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.guestPhone && <span className="form-error">{errors.guestPhone.message}</span>}
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <h3 className="price-breakdown__title">Price Breakdown</h3>
                  <div className="price-breakdown__items">
                    <div className="price-breakdown__item">
                      <span>{priceBreakdown.basePrice} × {numberOfGuests} guests</span>
                      <span>{priceBreakdown.subtotal}</span>
                    </div>
                    <div className="price-breakdown__total">
                      <strong>Total</strong>
                      <strong>{priceBreakdown.total}</strong>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn--primary btn--large booking-form__submit"
                  disabled={bookingLoading || !selectedDate || !selectedTimeSlot}
                >
                  {bookingLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Processing...
                    </>
                  ) : (
                    `Book Now - ${priceBreakdown.total}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourBooking; 