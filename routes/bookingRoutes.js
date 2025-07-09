const express = require('express');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

// Public routes for guest bookings (no authentication required)
router.get('/availability/:tourId', bookingController.getAvailability);
router.get('/time-slots/:tourId/:date', bookingController.getTimeSlots);
router.post('/reserve', bookingController.reserveBooking);
router.post('/checkout-session', bookingController.getCheckoutSession);
router.post('/confirm', bookingController.confirmBooking);
router.get('/verify', bookingController.verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);

// Admin routes (simplified, no authentication for now)
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
