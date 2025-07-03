const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  guestName: {
    type: String,
    required: [true, 'Booking must have a guest name'],
  },
  guestEmail: {
    type: String,
    required: [true, 'Booking must have a guest email'],
  },
  guestPhone: {
    type: String,
    required: [true, 'Booking must have a guest phone number'],
  },
  date: {
    type: Date,
    required: [true, 'Booking must have a date'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Booking must have a time slot'],
  },
  guests: {
    type: Number,
    required: [true, 'Booking must have number of guests'],
    min: 1,
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },
  paid: {
    type: Boolean,
    default: false,
  },
  stripeSessionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
