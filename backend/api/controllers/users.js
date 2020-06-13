/* database controllers for User model */
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const selectFields = '_id firstname lastname email password usertype';

/* CONTROLLERS WITH NO JWT GUARDING */
// create a user object
exports.create_user = (req, res, next) => {
    // check if user with the same email exists
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            // return error if user with the same email exists
            return res.status(400).json({ message: "Email already exists" });
        } else {
            // create a user object
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                usertype: req.body.usertype
            });
            // generate salt for password hashing
            bcrypt.genSalt(10, (err, salt) => {
                // hash user's password
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err)
                        // return error if there's any with password hashing
                        return res.status(500).json({ message: err.message });
                    // attach hashed password to user object
                    user.password = hash;
                    user.save().then(user => {
                        // wrap and return user object in response
                        const response = {
                            message: `Created user of id '${user._id}' successfully`,
                            user: user
                        }
                        return res.status(201).json({ response });
                    }).catch(error => {
                        // return error if there's any
                        return res.status(500).json({ message: `Unable to get CREATE user of id '${id}'`, error: error });
                    });
                });
            });
        }
    });
}

// login a user
exports.login_user = (req, res) => {
    // obtain email and password from request body
    const email = req.body.email;
    const password = req.body.password;

    // check if user exists by email
    User.findOne({ email }).then(user => {
        if (!user) {
            // return error if user with email isn't found
            return res.status(404).json({ message: "Email not found" });
        }
        // compare login password with user's
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // generate JWT payload from user object
                const payload = {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    usertype: user.usertype
                };
                // attach payload sign JWT generated
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
                // return error if password doesn't match
                return res.status(400).json({ message: "Password incorrect" });
            }
        });
    });
}

/* CONTROLLERS WITH JWT GUARDING */
// get all users in the system
exports.get_all_users = (req, res, next) => {
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
            // get all users from database
            User.find()
                .select(selectFields)
                .exec()
                .then(users => {
                    // wrap and return user objects in response
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
                    // return error if there's any
                    res.status(500).json({ message: `Unable to GET all users`, error: error });
                });
        }
    });
}

// check if email is taken
exports.check_email_taken = (req, res, next) => {
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
            // find user by email and return boolean if user exists or not
            User.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    return res.status(200).json({ exist: true });
                } else {
                    return res.status(200).json({ exist: false });
                }
            });
        }
    });
}

// get all customers from system
exports.get_all_customers = (req, res, next) => {
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
            // get all customers from database
            User.find({ usertype: "customer" })
                .select(selectFields)
                .exec()
                .then(customers => {
                    // wrap and return customer objects in response
                    const response = {
                        customers: customers.map(customer => {
                            return {
                                id: customer._id,
                                firstname: customer.firstname,
                                lastname: customer.lastname,
                                email: customer.email
                            }
                        })
                    }
                    res.status(200).json(response);
                })
                .catch(error => {
                    // return error if there's any
                    res.status(500).json({ message: `Unable to GET all customers!`, error: error });
                });
        }
    });
}

// get user by id
exports.get_user = (req, res, next) => {
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
        const id = req.params.userId;
        // get user by id from database
        User.findOne({ _id: id })
            .select(selectFields)
            .exec()
            .then(user => {
                // wrap and return user object in response
                const response = {
                    user: user
                }
                res.status(200).json(response);
            })
            .catch(error => {
                // return error if there's any
                res.status(500).json({ message: `Unable to GET user of id '${id}'`, error: error });
            })
    });
}

// delete user by id
exports.delete_user = (req, res, next) => {
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
            // obtain user id from request parameters
            const id = req.params.userId;
            // delete user by id in database
            User.findOneAndDelete({ _id: id })
                .select(selectFields)
                .exec()
                .then(user => {
                    // return success message in response
                    const response = {
                        message: `Deleted user of id '${user._id}' successfully`
                    }
                    res.status(200).json({ response });
                })
                .catch(error => {
                    // return error if there's any
                    res.status(500).json({ message: `Unable to DELETE user of id '${id}'`, error: error });
                });
        }
    })
}

// update user by id
exports.update_user = (req, res, next) => {
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
            // obtain user id from request parameters
            const id = req.params.userId;
            // obtaining updated values in request body
            const updateOps = {};
            for (const ops of Object.entries(req.body)) {
                updateOps[ops[0]] = ops[1];
            }
            // update user by id with updated values
            User.update({ _id: id }, { $set: updateOps })
                .select(selectFields)
                .exec()
                .then(user => {
                    // wrap and return user object in response
                    const response = {
                        message: `Updated user of id '${id}' successfully`,
                        user: user
                    }
                    res.status(200).json({ response });
                })
                .catch(error => {
                    res.status(500).json({ message: `Unable to UPDATE user of id '${id}'`, error: error });
                });
        }
    })
}
