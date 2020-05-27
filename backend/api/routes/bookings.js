const express = require('express');
const router = express.Router();


const BookingsController = require('../controllers/bookings');

// PLEASE REVIEW
router.get('/customers/:bookingId', BookingsController.get_user_booking);
router.get('/', BookingsController.get_user_bookings);
router.post('/', BookingsController.create_booking);
router.patch('/customers/:bookingId', BookingsController.update_booking);
// router.get('/customers', BookingsController.get_all_bookings);

module.exports = router;