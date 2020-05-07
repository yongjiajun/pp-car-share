const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    car: {type: mongoose.Schema.Types.ObjectId, ref: "Car"},
    bookeddatetime: Date,
    pickupdatetime: Date,
    returndatetime: Date,
    cost: Number,
    pickuplocation: {type: mongoose.Schema.Types.ObjectId, ref: "Location"},
    dropofflocation: {type: mongoose.Schema.Types.ObjectId, ref: "Location"},
    distance: Number,
    status: String
});

module.exports = mongoose.model('Booking', bookingSchema);