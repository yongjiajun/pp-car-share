const express = require('express');
const router = express.Router();


const BookingsController = require('../controllers/bookings');

// router.get('/', BookingsController.get_all_bookings);
// router.get('/:bookingId', BookingsController.get_booking);
router.get('/', BookingsController.get_user_bookings);
router.post('/', BookingsController.create_booking);
router.patch('/customer/:bookingId', BookingsController.update_booking);

module.exports = router;