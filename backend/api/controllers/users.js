const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id firstname lastname email password usertype';

/* CONTROLLERS WITH NO JWT GUARDING */
exports.create_user = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                usertype: req.body.usertype
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) return res.status(500).json({ message: err.message });
                    user.password = hash;
                    user.save().then(user => {
                        const response = {
                            message: `Created user of id '${user._id}' successfully`,
                            user: user
                        }
                        return res.status(201).json({ response });
                    }).catch(error => {
                        return res.status(500).json({ message: `Unable to get CREATE user of id '${id}'`, error: error })
                    })
                }
                )
            }
            )
        }
    }
    )
}

exports.login_user = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    usertype: user.usertype
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            id: user._id,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ message: "Password incorrect" });
            }
        });
    });
}

/* CONTROLLERS WITH JWT GUARDING */ 
exports.get_all_users = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.find()
            .select(selectFields)
            .exec()
            .then(users => {
                const response = {
                    users: users.map(user => {
                        return {
                            id: user._id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            password: user.password,
                            usertype: user.usertype
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(error => {
                res.status(500).json({ message: `Unable to GET all users`, error: error })
            });
    })
}

exports.get_user = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.userId;
        User.findOne({ _id: id })
            .select(selectFields)
            .exec()
            .then(user => {
                const response = {
                    user: user
                }
                res.status(200).json(response);
            })
            .catch(error => { res.status(500).json({ message: `Unable to GET user of id '${id}'`, error: error }) })
    });
}

exports.delete_user = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.userId;
        User.findOneAndDelete({ _id: id })
            .select(selectFields)
            .exec()
            .then(user => {
                const response = {
                    message: `Deleted user of id '${user._id}' successfully`
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to DELETE user of id '${id}'`, error: error }) })
    })
}

exports.update_user = (req, res, next) => {
    var token = req.headers['authorization'].replace(/^Bearer\s/, '');

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, keys.secretOrKey, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        const id = req.params.userId;
        const updateOps = {};
        console.log(Object.entries(req.body))
        for (const ops of Object.entries(req.body)) {
            updateOps[ops[0]] = ops[1];
        }
        User.update({ _id: id }, { $set: updateOps })
            .select(selectFields)
            .exec()
            .then(user => {
                const response = {
                    message: `Updated user of id '${user._id}' successfully`,
                    user: user
                }
                res.status(200).json({ response });
            })
            .catch(error => { res.status(500).json({ message: `Unable to UPDATE user of id '${id}'`, error: error }) })
    })
}