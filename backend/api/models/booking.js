const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: Schema.Types.ObjectId, ref: "User"},
    car: {type: Schema.Types.ObjectId, ref: "Car"},
    bookeddatetime: Date,
    pickupdatetime: Date,
    returndatetime: Date,
    cost: Number,
    pickuplocation: {type: Schema.Types.ObjectId, ref: "Location"},
    dropofflocation: {type: Schema.Types.ObjectId, ref: "Location"},
    distance: Number,
    status: String
});

module.exports = mongoose.model('Booking', bookingSchema);