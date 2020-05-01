const express = require('express');
const router = express.Router();


const CarsController = require('../controllers/cars');

router.get('/', CarsController.get_all_cars);
router.get('/:carId', CarsController.get_car);
router.post('/', CarsController.create_car);
router.delete('/:carId', CarsController.delete_car);
router.patch('/:carId', CarsController.update_car);

module.exports = router;