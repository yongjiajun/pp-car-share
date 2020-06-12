const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: {type: String, required: true},
    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
});

module.exports = mongoose.model('Location', locationSchema);
