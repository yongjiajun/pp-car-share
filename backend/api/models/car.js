const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    make: String,
    seats: String,
    bodytype: String,
    numberplate: String,
    colour: String,
    costperhour: Number,
    fueltype: String,
    totaldistance: Number,
    location: {type: Schema.Types.ObjectId, ref: "Location"},
    currentbooking: {type: Schema.Types.ObjectId, ref: "Booking"},
});

module.exports = mongoose.model('Car', carSchema);