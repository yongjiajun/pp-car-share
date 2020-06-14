/* Location model routes, connecting routes and controllers */
const express = require('express');
const router = express.Router();
const LocationsController = require('../controllers/locations');

// attach routes with controllers
router.get('/', LocationsController.get_all_locations);
router.get('/:locationId', LocationsController.get_location);
router.post('/', LocationsController.create_location);
router.patch('/:locationId', LocationsController.update_location);

module.exports = router;
