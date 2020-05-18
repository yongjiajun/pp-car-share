const Booking = require('../models/booking');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id user car bookeddatetime pickupdatetime returndatetime cost pickuplocation dropofflocation distance status';

/* CONTROLLERS WITH JWT GUARDING */ 
exports.create_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const booking = new Booking({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.user,
            car: req.body.car,
            bookeddatetime: Date.now,
            pickupdatetime: req.body.pickupdatetime,
            returndatetime: req.body.returndatetime,
            cost: req.body.cost,
            pickuplocation: req.body.pickuplocation,
            dropofflocation: req.body.dropofflocation,
            distance: req.body.distance,
            status: req.body.status
        });
        booking.save().then(booking => {
            const response = {
                message: `Created booking of id '${booking._id}' successfully`,
                booking: booking
            }
            return res.status(201).json({ response });
        }).catch(error => {
            return res.status(500).json({ message: `Unable to get CREATE booking of id '${id}'`, error: error })
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
                    booking: bookings.map(booking => {
                        return {
                            id: booking._id,
                            user: booking.user,
                            car: booking.car,
                            bookeddatetime: booking.bookeddatetime,
                            pickupdatetime: booking.pickupdatetime,
                            returndatetime: booking.returndatetime,
                            cost: booking.cost,
                            pickuplocation: booking.pickuplocation,
                            dropofflocation: booking.dropofflocation,
                            distance: booking.distance,
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

exports.delete_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.bookingId;
        Booking.findOneAndDelete({ _id: id })
            .select(selectFields)
            .exec()
            .then(booking => {
                const response = {
                    message: `Deleted booking of id '${booking._id}' successfully`
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to DELETE booking of id '${id}'`, error: error }) })
    })
}

exports.update_booking = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.bookingId;
        const updateOps = {};
        console.log(Object.entries(req.body))
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }
        Booking.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(booking => {
                const response = {
                    message: `Updated booking of id '${booking._id}' successfully`,
                    booking: booking
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to UPDATE booking of id '${id}'`, error: error }) })
    })
}
