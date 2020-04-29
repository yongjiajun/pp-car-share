const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    latitude: String,
    longitude: String,
    cars: []  // May need to update this with below
    /* cars: [{
        car: {type: Schema.Types.ObjectId, ref: 'Car' }
    }]*/
});

module.exports = mongoose.model('Location', locationSchema);