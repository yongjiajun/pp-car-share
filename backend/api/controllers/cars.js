/* database controllers for Car model */
const Car = require('../models/car');
const Booking = require('../models/booking');
const Location = require('../models/location')
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const bookingSelectFields = '_id user car bookedtime pickuptime returntime cost location status';
const selectFields = '_id make seats bodytype numberplate colour costperhour fueltype location currentbooking image';

/* CONTROLLERS WITHOUT JWT GUARDING */
// get all cars from system
exports.get_all_cars = (req, res, next) => {
    // get all cars from database
    Car.find()
        .select(selectFields)
        .exec()
        .then(cars => {
            // wrap and return car objects in response
            const response = {
                cars: cars.map(car => {
                    return {
                        id: car._id,
                        make: car.make,
                        seats: car.seats,
                        bodytype: car.bodytype,
                        numberplate: car.numberplate,
                        colour: car.colour,
                        costperhour: car.costperhour,
                        fueltype: car.fueltype,
                        location: car.location,
                        image: car.image,
                        currentbooking: car.currentbooking
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(error => {
            // return error if there's any
            res.status(500).json({ message: `Unable to GET all cars`, error: error });
        });
}

// get a particular car by id
exports.get_car = (req, res, next) => {
    // obtain car id from request parameters
    const id = req.params.carId;

    // get car by id from database
    Car.findOne({ _id: id })
        .select(selectFields)
        .exec()
        .then(car => {
            // wrap and return car object in response
            const response = {
                car: car
            }
            res.status(200).json(response);
        })
        .catch(error => {
            // return error if there's any
            res.status(500).json({ message: `Unable to GET car of id '${id}'`, error: error });
        });
}

/* CONTROLLERS WITH JWT GUARDING */
// create car object
exports.create_car = (req, res, next) => {
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

        // restrict feature to staff only
        if (decoded.usertype !== 'staff' && decoded.usertype !== 'admin') {
            return res.status(500).json({ message: `Unable to perform action, you have to be staff member!` });
        } else {
            // get location by car's pickup/return spot
            Location.findOne({ address: req.body.location }).then(location => {
                // create a car object
                const car = new Car({
                    _id: new mongoose.Types.ObjectId(),
                    make: req.body.make,
                    seats: req.body.seats,
                    bodytype: req.body.bodytype,
                    numberplate: req.body.numberplate,
                    colour: req.body.colour,
                    costperhour: req.body.costperhour,
                    fueltype: req.body.fueltype,
                    location: location,
                    image: req.body.b64photo,
                    currentbooking: null
                });
                // save car object
                car.save().then(car => {
                    // add car id into location's car list
                    location.cars.push(car._id);
                    location.save();
                    // wrap and return car object in response
                    const response = {
                        message: `Created car of id '${car._id}' successfully`,
                        car: car
                    }
                    return res.status(201).json({ response });
                }).catch(error => {
                    // return error if there's any
                    return res.status(500).json({ message: `Unable to get CREATE car of id '${_id}'`, error: error });
                });
            });
        }
    });
}

// delete a car by id
exports.delete_car = (req, res, next) => {
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
        // restrict feature to staff only
        if (decoded.usertype !== 'staff' && decoded.usertype !== 'admin') {
            return res.status(500).json({ message: `Unable to perform action, you have to be staff member!` });
        } else {
            // obtain car id from request parameters
            const id = req.params.carId;

            // find and delete a car by id
            Car.findOneAndDelete({ _id: id })
                .select(selectFields)
                .exec()
                .then(car => {
                    // return success message in response
                    const response = {
                        message: `Deleted car of id '${car._id}' successfully`
                    }
                    res.status(200).json({ response });
                })
                .catch(error => {
                    // return error if there's any
                    res.status(500).json({ message: `Unable to DELETE car of id '${id}'`, error: error });
                });
        }
    });
}

// update a car object by id
exports.update_car = (req, res, next) => {
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

        // restrict feature to staff only
        if (decoded.usertype !== 'staff' && decoded.usertype !== 'admin') {
            return res.status(500).json({ message: `Unable to perform action, you have to be staff member!` });
        } else {
            // obtain car id from request parameters
            const id = req.params.carId;
            // obtaining updated values in request body
            const updateOps = {};
            for (const ops of Object.entries(req.body)) {
                updateOps[ops[0]] = ops[1];
            }

            // update car by id with updated values
            Car.update({ _id: id }, { $set: updateOps })
                .select(selectFields)
                .exec()
                .then(car => {
                    // wrap and return car object in response
                    const response = {
                        message: `Updated car of id '${car._id}' successfully`,
                        car: car
                    }
                    res.status(200).json({ response });
                })
                .catch(error => {
                    // return error if there's any
                    res.status(500).json({ message: `Unable to UPDATE car of id '${id}'`, error: error });
                });
        }
    });
}

// search for available cars in specific timeframe
exports.search_available_cars = (req, res, next) => {
    // search_available_cars returns all available cars in specified time range
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

        // construct date objects for pickup and return time
        const pickupTime = new Date(req.body.pickupTime);
        const returnTime = new Date(req.body.returnTime);

        // validate pickup and return time
        if (pickupTime >= returnTime) {
            return res.status(400).json({ message: "Invalid date range! Please try again." })
        } else if (pickupTime < Date.now()) {
            return res.status(400).json({ message: "Time must be in the future! Please try again." });
        }

        // get all available cars within the period
        Car.find().select(selectFields).exec().then((cars) => {
            searchForAvailableCars(pickupTime, returnTime, cars).then(availableCars => {
                if (availableCars.length == 0) {
                    // return error if there are no cars available
                    return res.status(400).json({ message: "No cars are available at the moment." });
                } else {
                    // return all available cars
                    return res.status(200).json({ availableCars: availableCars });
                }
            });
        });
    });
}

// search for available cars in specific timeframe with filters
exports.filter_cars = (req, res, next) => {
    // filter_cars allows the filtering of car attributes
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token)
        return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        // query all available cars and then filter if necessary
        carQuery = Car.find();
        make = req.body.make;
        if (make != "") {
            carQuery = carQuery.find({ make: new RegExp(make, 'i') });
        }
        seats = req.body.seats;
        if (seats != "Any") {
            carQuery = carQuery.find({ seats: seats });
        }
        fueltype = req.body.fueltype;
        if (fueltype != "Any") {
            carQuery = carQuery.find({ fueltype: fueltype });
        }
        colour = req.body.colour;
        if (colour != "Any") {
            carQuery = carQuery.find({ colour: colour });
        }
        location = req.body.location;
        if (location != "Any") {
            carQuery = carQuery.find({ location: location });
        }
        bodytype = req.body.bodytype;
        if (bodytype != "Any") {
            carQuery = carQuery.find({ bodytype: bodytype });
        }

        // construct date objects for pickup and return time
        const pickupTime = new Date(req.body.pickupTime);
        const returnTime = new Date(req.body.returnTime);

        // get available cars with above filters
        carQuery.select(selectFields).exec().then(cars => {
            searchForAvailableCars(pickupTime, returnTime, cars)
                .then(availableCars => {
                    if (availableCars.length == 0) {
                        // return error if there are no cars available
                        return res.status(400).json({ message: "No cars are available with selected attributes." });
                    }
                    else {
                        // return all available cars
                        return res.status(200).json({ availableCars: availableCars });
                    }
                });
        });
    });
}

// get all available cars specified within time range
function searchForAvailableCars(pickupTime, returnTime, cars) {
    return new Promise(async (resolve, reject) => {
        var availableCars = [];
        // loop through all bookings of all cars and check each booking time range
        cars.forEach(async function (car, i) {
            var available = await checkCarAvailable(pickupTime, returnTime, car._id);
            if (available) {
                availableCars.push(car);
            }
            if (i === cars.length - 1) {
                resolve(availableCars);
            }
        });
    });
}

// get the availability of a car specified within time range
function checkCarAvailable(pickupTime, returnTime, carId) {
    var available = true;
    return new Promise((resolve, reject) => {
        // obtain car bookings
        Booking.find({ car: carId }).select(bookingSelectFields).exec().then(carBookings => {
            if (carBookings.length != 0) {
                for (i in carBookings) {
                    // loop through a car's bookings to determine if a car is being used
                    if ((carBookings[i].status === "Confirmed") || (carBookings[i].status === "Active")) {
                        // determine if booking time and pickup/return time clashes
                        available = Math.max(carBookings[i].pickuptime, carBookings[i].returntime) < Math.min(pickupTime, returnTime);
                        if (!available) {
                            break;
                        }
                    }
                }
            }
            resolve(available);
        });
    });
}
