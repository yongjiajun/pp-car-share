/* Booking model definition */
const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    bookedtime: { type: Date, required: true },
    pickuptime: { type: Date, required: true },
    returntime: { type: Date, required: true },
    cost: { type: Number, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
