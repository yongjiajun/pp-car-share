const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    make: String,
    seats: String,
    bodytype: String,
    numberPlate: String,
    colour: String,
    costPerHour: Number,
    fuelType: String,
    totalDistance: Number,
    // location: {type: Schema.Types.ObjectId, ref: "Location"},
    // currentBooking: {type: Schema.Types.ObjectId, ref: "Booking"},
});

module.exports = mongoose.model('Car', userSchema);