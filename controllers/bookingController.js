const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// Helper function to send booking confirmation email
const sendBookingConfirmationEmail = async (booking) => {
  const subject = `Booking Confirmation - ${booking.tour.name}`;
  const message = `
Dear ${booking.guestName},

Thank you for booking with ParisTours! Your booking has been confirmed.

Booking Details:
- Tour: ${booking.tour.name}
- Date: ${new Date(booking.date).toDateString()}
- Time: ${booking.timeSlot}
- Number of Guests: ${booking.guests}
- Total Amount: $${(booking.price * booking.guests).toFixed(2)}
- Booking ID: ${booking._id}

Please arrive 15 minutes before your scheduled time.

If you have any questions, please contact us.

Best regards,
ParisTours Team
  `;

  await sendEmail({
    email: booking.guestEmail,
    subject,
    message,
  });
};

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
    success_url: `${process.env.FRONTEND_URL || process.env.PRODUCTION_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || process.env.PRODUCTION_URL || 'http://localhost:5173'}/payment/cancel`,
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
  const { session_id } = req.query;

  if (!session_id) {
    return next(new AppError('Session ID is required', 400));
  }

  const booking = await Booking.findOne({ stripeSessionId: session_id }).populate('tour');
  
  if (!booking) {
    return next(new AppError('No booking found with that session ID', 404));
  }

  // Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status === 'paid') {
    // Update booking if not already paid
    if (!booking.paid) {
      booking.paid = true;
      await booking.save();
      
      // Send confirmation email
      try {
        await sendBookingConfirmationEmail(booking);
        console.log('Booking confirmation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
        // Don't fail the entire request if email fails
      }
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Verify payment status by session ID (GET route)
exports.verifyPaymentBySession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return next(new AppError('Session ID is required', 400));
  }

  const booking = await Booking.findOne({ stripeSessionId: sessionId }).populate('tour');
  if (!booking) {
    return next(new AppError('No booking found with that session ID', 404));
  }

  // Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === 'paid') {
    // Update booking if not already paid
    if (!booking.paid) {
      booking.paid = true;
      await booking.save();
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

// Webhook handler for Stripe events
exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Find and update the booking
    const booking = await Booking.findOne({ stripeSessionId: session.id }).populate('tour');
    if (booking && !booking.paid) {
      booking.paid = true;
      await booking.save();
      
      // Send confirmation email
      try {
        await sendBookingConfirmationEmail(booking);
        console.log('Booking confirmation email sent via webhook');
      } catch (emailError) {
        console.error('Failed to send booking confirmation email via webhook:', emailError);
      }
    }
  }

  res.status(200).json({ received: true });
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
