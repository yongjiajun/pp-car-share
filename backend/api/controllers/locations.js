const Location = require('../models/location');
const mongoose = require('mongoose');

exports.get_all_locations = (req, res) => {
    Location.find()
        .then(locations => res.json(locations))
        .catch(err => res.status(400).json('Error: ') + err);
}

exports.get_location = locationid = (req, res) => {
    res.send("hi")
}

exports.create_location = location = (req, res) => {
    
}