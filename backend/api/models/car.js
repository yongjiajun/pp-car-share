const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    make: {type: String, required: true},
    seats: {type: Number, required: true},
    bodytype: {type: String, required: true},
    numberplate: {type: String, required: true},
    colour: {type: String, required: true},
    costperhour: {type: Number, required: true},
    fueltype: {type: String, required: true},
    location: {type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true},
    currentbooking: {type: mongoose.Schema.Types.ObjectId, ref: "Booking"},
    image: String
});

module.exports = mongoose.model('Car', carSchema);