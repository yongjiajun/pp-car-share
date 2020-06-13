/* database controllers for Booking model */
const Booking = require('../models/booking');
const Car = require('../models/car')
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id user car bookedtime pickuptime returntime cost location status';

/* CONTROLLERS WITH JWT GUARDING */
// create a booking for customers
exports.create_booking = (req, res, next) => {
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

        // obtaining form values
        const pickupTime = localiseTimeZone(new Date(req.body.pickupTime));
        const returnTime = localiseTimeZone(new Date(req.body.returnTime));

        // make current time as user's booking time
        const bookedTime = localiseTimeZone(new Date());

        // calculate time difference between return and pickup time
        const timeDeltaHours = new Date(returnTime - pickupTime).getTime() / 3600;

        // look for requested car for booking
        Car.findById(req.body.car)
            .then(car => {
                // calculate booking cost
                const cost = parseInt(car.costperhour) * (timeDeltaHours / 1000);
                // create new booking object
                const booking = new Booking({
                    _id: new mongoose.Types.ObjectId(),
                    user: req.body.user,
                    car: req.body.car,
                    bookedtime: bookedTime,
                    pickuptime: pickupTime,
                    returntime: returnTime,
                    cost: cost.toFixed(2),
                    location: req.body.location,
                    status: "Confirmed"
                });
                // save booking object and return in response
                booking.save().then(booking => {
                    const response = {
                        message: `Created booking of id '${booking._id}' successfully`,
                        booking: booking
                    }
                    return res.status(201).json({ response });
                }).catch(error => {
                    // return error if there's any
                    return res.status(500).json({ message: `Unable to get CREATE booking`, error: error });
                });
            });
    });
}

// obtain all customers bookings from the system
exports.get_all_bookings = (req, res, next) => {
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
            return res.status(500).json({ message: `Unable to perform action, you have to be staff member!` })
        } else {
            // get all bookings from database
            Booking.find()
                .select(selectFields)
                .exec()
                .then(bookings => {
                    // wrap and return all booking objects in response
                    const response = {
                        bookings: bookings.map(booking => {
                            return {
                                id: booking._id,
                                user: booking.user,
                                car: booking.car,
                                bookedtime: booking.bookedtime,
                                pickuptime: booking.pickuptime,
                                returntime: booking.returntime,
                                cost: booking.cost,
                                location: booking.location,
                                status: booking.status
                            }
                        })
                    }
                    res.status(200).json(response);
                })
                .catch(error => {
                    // return error if there's any
                    res.status(500).json({ message: `Unable to GET all bookings`, error: error });
                });
        }
    });
}

// get all bookings from a particular user
exports.get_user_bookings = (req, res, next) => {
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

        // obtain user id from request parameters
        const userId = req.params.userId;

        // obtain bookings from a particular user by user id
        Booking.find({ user: userId })
            .select(selectFields)
            .exec()
            .then(bookings => {
                // wrap and return all booking objects in response
                const response = {
                    bookings: bookings.map(booking => {
                        return {
                            id: booking._id,
                            user: booking.user,
                            car: booking.car,
                            bookedtime: booking.bookedtime,
                            pickuptime: booking.pickuptime,
                            returntime: booking.returntime,
                            cost: booking.cost,
                            location: booking.location,
                            status: booking.status
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(error => {
                // return error if there's any
                res.status(500).json({ message: `Unable to GET user's bookings`, error: error });
            });
    });
}

// obtain a booking from the user sending the request
exports.get_user_booking = (req, res, next) => {
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

        // obtain booking id from request parameters
        const id = req.params.bookingId;

        // obtain a user's booking by using JWT decoded user id and booking id 
        Booking.findOne({ _id: id, user: decoded.id })
            .select(selectFields)
            .exec()
            .then(booking => {
                // wrap and return booking in response
                const response = {
                    booking: booking
                }
                res.status(200).json(response);
            })
            .catch(error => {
                res.status(500).json({ message: `Unable to GET booking of id '${id}'`, error: error });
            });
    });
}

// get a particular booking by id
exports.get_booking = (req, res, next) => {
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

        // obtain booking id from request parameters
        const id = req.params.bookingId;

        // obtain a booking by booking id
        Booking.findOne({ _id: id })
            .select(selectFields)
            .exec()
            .then(booking => {
                // wrap and return booking object in response
                const response = {
                    booking: booking
                }
                res.status(200).json(response);
            })
            .catch(error => {
                // return error if there's any
                res.status(500).json({ message: `Unable to GET booking of id '${id}'`, error: error })
            });
    });
}

// update a booking object, mainly used for changing booking status
exports.update_booking = (req, res, next) => {
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

        // obtain booking id from request parameters
        const id = req.params.bookingId;
        // obtaining updated values in request body
        const updateOps = {};
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }

        // update particular booking by id with updated values
        Booking.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(booking => {
                // check booking updated status
                if (req.body.status === 'Picked up') {
                    // set car's current booking id if car is being picked up
                    Car.update({ _id: req.body.car }, { $set: { currentbooking: req.body._id } }).select("currentbooking").exec();
                } else if (req.body.status === 'Returned') {
                    // set car's current booking id to null if car is being returned
                    Car.update({ _id: req.body.car }, { $set: { currentbooking: null } }).select("currentbooking").exec();
                }
                // wrap and return booking object in response
                const response = {
                    message: `Updated booking of id '${booking._id}' successfully`,
                    booking: booking
                }
                res.status(200).json({ response });
            })
            .catch(error => {
                // return error if there's any
                res.status(500).json({ message: `Unable to UPDATE booking of id '${id}'`, error: error })
            });
    });
}

// obtain a user's upcoming booking if any
exports.get_upcoming_booking = (req, res, next) => {
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

        // return bookings whose car has been picked up but hasn't been returned yet
        Booking.find({ status: "Picked up", user: decoded.id }).sort({ returntime: 1 }).then(bookings => {
            // check if response has been sent (return res.status(200) doesn't work)
            var resSent = false;
            // return first booking whose car hasn't been returned
            bookings.forEach(booking => {
                if (!resSent) {
                    res.status(200).json(booking);
                    resSent = true;
                }
            })
            if (!resSent) {
                // check for upcoming confirmed bookings
                Booking.find({ returntime: { $gte: localiseTimeZone(new Date()) }, user: decoded.id, status: "Confirmed" }).sort({ pickuptime: 1 }).then(bookings => {
                    if (bookings.length !== 0) {
                        // return upcoming booking with pickup time closest to current time
                        res.status(200).json(bookings[0])
                    } else {
                        // return nothing if there aren't any confirmed bookings
                        res.status(200).json({})
                    }
                });
            }
        });
    });
}

function localiseTimeZone(date) {
    // hours offset from UTC for Melbourne (GMT+10)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
}
