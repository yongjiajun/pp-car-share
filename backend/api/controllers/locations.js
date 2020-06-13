/* database controllers for Location model */
const Location = require('../models/location');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id name address cars';

/* CONTROLLERS WITHOUT JWT GUARDING */
// get all locations from system
exports.get_all_locations = (req, res) => {
    // obtain all locations from database
    Location.find()
        // return location objects in response
        .then(locations => res.json(locations))
        // return error if there's any
        .catch(err => res.status(400).json('Error: ') + err);
}

// get a location by id
exports.get_location = (req, res) => {
    // obtain location id from request parameters
    const id = req.params.locationId;
    // get location object by id from database
    Location.findById(id)
        // return location object in response
        .then(location => res.json(location))
        // return error if there's any
        .catch(err => res.status(400).json('Error: ' + err));
}

/* CONTROLLERS WITH JWT GUARDING */
// update location object by id
exports.update_location = (req, res) => {
    // obtain JWT from authorization header and remove Bearer keyword
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token)
        // return 401 response if JWT doesn't exist in request
        return res.status(401).send({ auth: false, message: 'No token provided.' });

    // attempt to verify JWT
    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err)
            // return error if JWT is invalid
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        // obtain location id from request parameters
        const id = req.params.locationId;
        // obtaining updated values in request body
        const updateOps = {};
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }

        // update particular location by id with updated values
        Location.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(location => {
                // return success message in response
                const response = {
                    message: `Updated location of id '${location._id}' successfully`
                }
                res.status(200).json({ response });
            })
            .catch(error => {
                // return error if there's any
                res.status(500).json({ message: `Unable to UPDATE location of id '${id}'`, error: error });
            });
    });
}

// create location object
exports.create_location = loc = (req, res) => {
    // obtain JWT from authorization header and remove Bearer keyword
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token)
        // return 401 response if JWT doesn't exist in request
        return res.status(401).send({ auth: false, message: 'No token provided.' });

    // attempt to verify JWT
    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err)
            // return error if JWT is invalid
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        // obtain location address from request body
        const req_address = req.body.address;
        
        // check if location with same address already exists
        Location.findOne({ address: req_address }).then(location => {
            if (location) {
                // return error if location with the same address already exsits
                return res.status(400).json({ address: "Address already exists" });
            } else {
                // create a location object
                const location = new Location({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    address: req.body.address,
                    cars: []
                });
                // save location object and return success message in response
                location.save().then(location => {
                    res.json('New location added')
                });
            }
        });
    });
}
