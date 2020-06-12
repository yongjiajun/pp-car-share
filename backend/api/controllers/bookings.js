const Booking = require('../models/booking');
const Car = require('../models/car')
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id user car bookedtime pickuptime returntime cost location status';

/* CONTROLLERS WITH JWT GUARDING */
exports.create_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const pickupTime = localiseTimeZone(new Date(req.body.pickupTime));
        const returnTime = localiseTimeZone(new Date(req.body.returnTime));
        const bookedTime = localiseTimeZone(new Date());
        const timeDeltaHours = new Date(returnTime - pickupTime).getTime() / 3600;

        Car.findById(req.body.car)
            .then(car => {
                const cost = parseInt(car.costperhour) * (timeDeltaHours / 1000);
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
                booking.save().then(booking => {
                    const response = {
                        message: `Created booking of id '${booking._id}' successfully`,
                        booking: booking
                    }
                    return res.status(201).json({ response });
                }).catch(error => {
                    return res.status(500).json({ message: `Unable to get CREATE booking`, error: error })
                })
        })
    })
}

exports.get_all_bookings = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        Booking.find()
            .select(selectFields)
            .exec()
            .then(bookings => {
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
                res.status(500).json({ message: `Unable to GET all bookings`, error: error })
            });
    })
}

exports.get_user_bookings = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const userId = req.params.userId;
        Booking.find({ user: userId })
            .select(selectFields)
            .exec()
            .then(bookings => {
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
                res.status(500).json({ message: `Unable to GET user's bookings`, error: error })
            });
    })
}

exports.get_user_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        const id = req.params.bookingId;
        Booking.findOne({ _id: id, user: decoded.id })
            .select(selectFields)
            .exec()
            .then(booking => {
                const response = {
                    booking: booking
                }
                res.status(200).json(response);
            })
            .catch(error => { res.status(500).json({ message: `Unable to GET booking of id '${id}'`, error: error }) })
    });
}

exports.get_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.bookingId;
        Booking.findOne({ _id: id })
            .select(selectFields)
            .exec()
            .then(booking => {
                const response = {
                    booking: booking
                }
                res.status(200).json(response);
            })
            .catch(error => { res.status(500).json({ message: `Unable to GET booking of id '${id}'`, error: error }) })
    });
}

exports.update_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.bookingId;
        const updateOps = {};
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }
        Booking.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(booking => {
                if (req.body.status === 'Picked up') {
                    // set car's current booking id if car is being picked up
                    Car.update({ _id: req.body.car }, {$set: { currentbooking: req.body._id }}).select("currentbooking").exec();
                } else if (req.body.status === 'Returned') {
                    // set car's current booking id to null if car is being returned
                    Car.update({ _id: req.body.car }, {$set: { currentbooking: null }}).select("currentbooking").exec();
                }
                const response = {
                    message: `Updated booking of id '${booking._id}' successfully`,
                    booking: booking
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to UPDATE booking of id '${id}'`, error: error }) })
    })
}

exports.check_ready_pickup_return = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        Booking.find({status: "Picked up", user: decoded.id}).sort({ returntime: 1 }).then(bookings => {
            var returned = false;
            bookings.forEach(booking => {
                if (!returned) {
                    res.status(200).json(booking);
                    returned = true;
                }
            })
            if (!returned) {
                Booking.find({returntime: { $gte: localiseTimeZone(new Date()) }, user: decoded.id, status: "Confirmed" }).sort({ pickuptime: 1 }).then(bookings => {
                    if (bookings.length !== 0) {
                        res.status(200).json(bookings[0])
                    } else {
                        res.status(200).json({})
                    }
                })
            }
        })
    })
}
 
function localiseTimeZone(date) {
    // hours offset from UTC for Melbourne (GMT+10)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date;
}
