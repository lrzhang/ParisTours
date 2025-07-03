const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// Get availability for a specific tour and date
exports.getAvailability = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const { date } = req.query;

  if (!date) {
    return next(new AppError('Please provide a date', 400));
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Get bookings for the specific date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    tour: tourId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    paid: true,
  });

  // Use default time slots if none are configured
  const timeSlots = tour.timeSlots.length > 0 ? tour.timeSlots : 
    tour.defaultTimeSlots.map(time => ({
      time,
      maxCapacity: tour.maxGroupSize
    }));

  // Calculate availability for each time slot
  const availability = timeSlots.map(slot => {
    const slotBookings = bookings.filter(booking => booking.timeSlot === slot.time);
    const bookedGuests = slotBookings.reduce((total, booking) => total + booking.guests, 0);
    
    return {
      time: slot.time,
      available: slot.maxCapacity - bookedGuests,
      maxCapacity: slot.maxCapacity,
      bookedGuests,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      date,
      availability,
    },
  });
});

// Get available time slots for a specific tour and date
exports.getTimeSlots = catchAsync(async (req, res, next) => {
  const { tourId, date } = req.params;

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Use default time slots if none are configured
  const timeSlots = tour.timeSlots.length > 0 ? tour.timeSlots : 
    tour.defaultTimeSlots.map(time => ({
      time,
      maxCapacity: tour.maxGroupSize
    }));

  res.status(200).json({
    status: 'success',
    data: {
      timeSlots,
    },
  });
});

// Reserve a booking temporarily
exports.reserveBooking = catchAsync(async (req, res, next) => {
  const { tourId, guestName, guestEmail, guestPhone, date, timeSlot, guests } = req.body;

  // Validate required fields
  if (!tourId || !guestName || !guestEmail || !guestPhone || !date || !timeSlot || !guests) {
    return next(new AppError('All fields are required', 400));
  }

  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Check availability
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await Booking.find({
    tour: tourId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    timeSlot,
    paid: true,
  });

  const bookedGuests = existingBookings.reduce((total, booking) => total + booking.guests, 0);
  const maxCapacity = tour.maxGroupSize;

  if (bookedGuests + guests > maxCapacity) {
    return next(new AppError('Not enough capacity available for this time slot', 400));
  }

  // Calculate price
  const price = tour.price * guests;

  // Create temporary booking (not paid yet)
  const booking = await Booking.create({
    tour: tourId,
    guestName,
    guestEmail,
    guestPhone,
    date,
    timeSlot,
    guests,
    price,
    paid: false,
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Create Stripe checkout session for guest booking
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return next(new AppError('Booking ID is required', 400));
  }

  const booking = await Booking.findById(bookingId).populate('tour');
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  if (booking.paid) {
    return next(new AppError('This booking has already been paid', 400));
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get('host')}/?cancelled=true`,
    customer_email: booking.guestEmail,
    client_reference_id: booking.id,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: booking.price * 100, // Stripe works with cents
          product_data: {
            name: `${booking.tour.name} Tour`,
            description: `${booking.guests} guest(s) - ${booking.date.toDateString()} at ${booking.timeSlot}`,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      bookingId: booking.id,
    },
  });

  // Update booking with session ID
  booking.stripeSessionId = session.id;
  await booking.save();

  res.status(200).json({
    status: 'success',
    session,
  });
});

// Confirm booking after successful payment
exports.confirmBooking = catchAsync(async (req, res, next) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return next(new AppError('Session ID is required', 400));
  }

  const booking = await Booking.findOne({ stripeSessionId: sessionId });
  if (!booking) {
    return next(new AppError('No booking found with that session ID', 404));
  }

  // Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === 'paid') {
    booking.paid = true;
    await booking.save();

    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } else {
    return next(new AppError('Payment not confirmed', 400));
  }
});

// Verify payment status
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  const booking = await Booking.findOne({ stripeSessionId: sessionId }).populate('tour');
  if (!booking) {
    return next(new AppError('No booking found with that session ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Get featured tour (for landing page)
exports.getFeaturedTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne().sort({ ratingsAverage: -1 });
  
  if (!tour) {
    return next(new AppError('No tours found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Keep existing factory methods for admin functionality (simplified)
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
