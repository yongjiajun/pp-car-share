const Location = require('../models/location');
const mongoose = require('mongoose');

exports.get_all_locations = (req, res) => {
    Location.find()
        .then(locations => res.json(locations))
        .catch(err => res.status(400).json('Error: ') + err);
}

exports.get_location = (req, res) => {
    const id = req.params.locationId;
    Location.findById(id)
        .then(location => res.json(location))
        .catch(err => res.status(400).json('Error: ' + err))
}

exports.create_location = loc = (req, res) => {
    const req_address = req.body.address;
    Location.findOne({ address: req_address}).then(location => {
        if(location) {
            return res.status(400).json({ address: "Address already exists" });
        } else {
            const location = new Location({
                _id: new mongoose.Types.ObjectId(),
                address: req.body.address
            });
            location.save().then(location => {
                res.json('New location added')
            })
        }
    })
}