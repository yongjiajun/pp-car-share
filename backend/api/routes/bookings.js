/* Booking model routes, connecting routes and controllers */
const express = require('express');
const router = express.Router();
const BookingsController = require('../controllers/bookings');

// attach routes with controllers
router.get('/customers/all', BookingsController.get_all_bookings);
router.get('/customers/next', BookingsController.get_upcoming_booking);
router.get('/customers/:bookingId', BookingsController.get_user_booking);
router.get('/:bookingId', BookingsController.get_booking);
router.get('/customers/all/:userId', BookingsController.get_user_bookings);
router.post('/', BookingsController.create_booking);
router.patch('/customers/:bookingId', BookingsController.update_booking);

module.exports = router;
