/* backend main app file with config */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const parser = require('body-parser');
const dotenv = require('dotenv');
const passport = require("passport");
const users_routes = require('./api/routes/users');
const locations_routes = require('./api/routes/locations');
const bookings_routes = require('./api/routes/bookings');
const cars_routes = require('./api/routes/cars');
dotenv.config();

const db_uri = process.env.MONGO_URI || "mongodb://localhost:27017"

// MongoDB Connection
mongoose.connect(db_uri + '/ppcarshare', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('DB Connected:' + db_uri))
    .catch(err => {
        console.log(process.env.MONGO_URI)
        console.log('DB Connection Error: ' + err.message);
    });
mongoose.Promise = global.Promise;

// Logger
app.use(logger('dev'));

// Parser and set file upload limit
app.use(parser.urlencoded({ limit: '4mb', extended: true }));
app.use(parser.json({limit: '4mb'}));

// CORS Handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Passport Middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// Routes
app.use('/api/users', users_routes);
app.use('/api/locations', locations_routes);
app.use('/api/bookings', bookings_routes);
app.use('/api/cars', cars_routes);

// Error Handling
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

module.exports = app;
