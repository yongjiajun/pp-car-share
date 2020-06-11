const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    make: String,
    seats: Number,
    bodytype: String,
    numberplate: String,
    colour: String,
    costperhour: Number,
    fueltype: String,
    location: {type: mongoose.Schema.Types.ObjectId, ref: "Location"},
    currentbooking: {type: mongoose.Schema.Types.ObjectId, ref: "Booking"},
    image: String
});

module.exports = mongoose.model('Car', carSchema);