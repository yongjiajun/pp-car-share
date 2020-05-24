const Car = require('../models/car');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id make seats bodytype numberplate colour costperhour fueltype location currentbooking';

/* CONTROLLERS WITH JWT GUARDING */ 
exports.create_car = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const car = new Car({
            _id: new mongoose.Types.ObjectId(),
            make: req.body.make,
            seats: req.body.seats,
            bodytype: req.body.bodytype,
            numberplate: req.body.numberplate,
            colour: req.body.colour,
            costperhour: req.body.costperhour,
            fueltype: req.body.fueltype,
            location: req.body.location,
            currentbooking: req.body.currentbooking
        });
        car.save().then(car => {
            const response = {
                message: `Created car of id '${car._id}' successfully`,
                car: car
            }
            return res.status(201).json({ response });
        }).catch(error => {
            return res.status(500).json({ message: `Unable to get CREATE car of id '${id}'`, error: error })
        })
    })
}

exports.get_all_cars = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        Car.find()
            .select(selectFields)
            .exec()
            .then(cars => {
                const response = {
                    car: cars.map(car => {
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
    })
}

exports.get_car = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

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
    });
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
