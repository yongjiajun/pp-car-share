const Car = require('../models/car');
const Booking = require('../models/booking');
const Location = require('../models/location')
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const bookingSelectFields = '_id user car bookedtime pickuptime returntime cost location status';
const selectFields = '_id make seats bodytype numberplate colour costperhour fueltype location currentbooking';

/* CONTROLLERS WITH JWT GUARDING */
exports.create_car = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        Location.findOne({ address: req.body.location }).then(location => {
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
                currentbooking: null
            });
            car.save().then(car => {
                location.cars.push(car._id);
                location.save();
                const response = {
                    message: `Created car of id '${car._id}' successfully`,
                    car: car
                }
                return res.status(201).json({ response });
            }).catch(error => {
                return res.status(500).json({ message: `Unable to get CREATE car of id '${_id}'`, error: error })
            })
        });        
    });
}

exports.get_all_cars = (req, res, next) => {
    Car.find()
        .select(selectFields)
        .exec()
        .then(cars => {
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
                        currentbooking: car.currentbooking
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({ message: `Unable to GET all cars`, error: error })
        });
}

exports.get_car = (req, res, next) => {
    const id = req.params.carId;
    Car.findOne({ _id: id })
        .select(selectFields)
        .exec()
        .then(car => {
            const response = {
                car: car
            }
            res.status(200).json(response);
        })
        .catch(error => { res.status(500).json({ message: `Unable to GET car of id '${id}'`, error: error }) })
}

exports.delete_car = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.carId;
        Car.findOneAndDelete({ _id: id })
            .select(selectFields)
            .exec()
            .then(car => {
                const response = {
                    message: `Deleted car of id '${car._id}' successfully`
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to DELETE car of id '${id}'`, error: error }) })
    })
}

exports.update_car = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.carId;
        const updateOps = {};
        console.log(Object.entries(req.body))
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }
        Car.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(car => {
                const response = {
                    message: `Updated car of id '${car._id}' successfully`,
                    car: car
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to UPDATE car of id '${id}'`, error: error }) })
    })
}

exports.search_available_cars = (req, res, next) => {
    // search_available_cars returns all available cars in specified time range
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        // construct date objects for pickup and return time
        const pickupTime = new Date(req.body.pickupTime);
        const returnTime = new Date(req.body.returnTime);

        // validate pickup and return time
        if (pickupTime >= returnTime) {
            return res.status(400).json({ message: "Invalid date range! Please try again." })
        } else if (pickupTime < Date.now()) {
            return res.status(400).json({ message: "Time must be in the future! Please try again." })
        }

        // get all available cars within the period
        Car.find().select(selectFields).exec().then((cars) => {
            searchForAvailableCars(pickupTime, returnTime, cars).then(availableCars => {
                if (availableCars.length == 0) {
                    return res.status(400).json({ message: "No cars are available at the moment." })
                } else {
                    return res.status(200).json({ availableCars: availableCars });
                }
            });
        });
    })
}

exports.filter_cars = (req, res, next) => {
    /* REQUIRED PARAMETERS: 
        req.body.make
        req.body.seats
        req.body.fueltype
        req.body.colour
        req.body.location (LOCATION OBJECT ID)
        req.body.bodytype
        req.body.pickupTime
        req.body.returnTime
    */

    // filter_cars allows the filtering of car attributes
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

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

        carQuery.select(selectFields).exec().then(cars => {
            searchForAvailableCars(pickupTime, returnTime, cars)
                .then(availableCars => {
                    if (availableCars.length == 0) {
                        return res.status(400).json({ message: "No cars are available with selected attributes." })
                    }
                    else {
                        return res.status(200).json({ availableCars: availableCars });
                    }
                })
        })
    });
}

function searchForAvailableCars(pickupTime, returnTime, cars) {
    // searchForAvailableCars returns all available cars specified within time range
    return new Promise(async (resolve, reject) => {
        var availableCars = []
        // loop through all bookings of all cars and check each booking time range
        cars.forEach(async function(car, i) {
            var available = await checkCarAvailable(pickupTime, returnTime, car._id);
                if (available) {
                    availableCars.push(car);
                }
                if (i === cars.length - 1) {
                    resolve(availableCars);
                }
        })
    })
}

function checkCarAvailable(pickupTime, returnTime, carId) {
    // checkCarAvailable returns the availability of a car specified within time range
    var available = true;
    return new Promise((resolve, reject) => {
        Booking.find({ car: carId }).select(bookingSelectFields).exec().then(carBookings => {
            if (carBookings.length != 0) {
                for (i in carBookings) {
                    if ((carBookings[i].status === "Confirmed") || (carBookings[i].status === "Active")) {
                        available = Math.max(carBookings[i].pickuptime, carBookings[i].returntime) < Math.min(pickupTime, returnTime);
                        if (!available) {
                            break;
                        }
                    }
                }
            }
            resolve(available);
        })
    })
}
