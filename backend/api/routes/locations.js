const express = require('express');
const router = express.Router();

const LocationsController = require('../controllers/locations');

router.get('/', LocationsController.get_all_locations);
router.get('/:locationId', LocationsController.get_location);
router.post('/', LocationsController.create_location);

module.exports = router;