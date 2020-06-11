const Location = require('../models/location');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id name address cars';

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

exports.update_location =(req, res) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.locationId;
        const updateOps = {};
        console.log(Object.entries(req.body))
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }
        Location.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(location => {
                const response = {
                    message: `Updated location of id '${location._id}' successfully`
                }
                res.status(200).json({ response });
            })
            .catch(error => { console.log(error)
                res.status(500).json({ message: `Unable to UPDATE location of id '${id}'`, error: error }) })
    })
}

exports.create_location = loc = (req, res) => {
    const req_address = req.body.address;
    Location.findOne({ address: req_address}).then(location => {
        if(location) {
            return res.status(400).json({ address: "Address already exists" });
        } else {
            const location = new Location({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                address: req.body.address,
                cars: []
            });
            location.save().then(location => {
                res.json('New location added')
            })
        }
    })
}