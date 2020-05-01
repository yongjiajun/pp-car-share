const express = require('express');
const router = express.Router();


const BookingsController = require('../controllers/bookings');

router.get('/', BookingsController.get_all_bookings);
router.get('/:bookingId', BookingsController.get_booking);
router.post('/', BookingsController.create_booking);
router.delete('/:bookingId', BookingsController.delete_booking);
router.patch('/:bookingId', BookingsController.update_booking);

module.exports = router;