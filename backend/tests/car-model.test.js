const CarModel = require('../api/models/car');
const LocationModel = require('../api/models/location');
const mongoose = require('mongoose');
const locationData = { _id: new mongoose.Types.ObjectId(), cars: [], name: "Test Garage", address: "30 Swanston Street, Vic, Melbourne" }

const test_uri = "mongodb://localhost:27017/pp-test"

let testLocation;

describe('insert new car into collection', () => {
    beforeAll(async () => {
      await mongoose.connect(test_uri, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
          if (err) {
              console.error(err);
              process.exit(1);
          }
      });
      const location = new LocationModel(locationData);
      testLocation = await location.save();

    });

    afterAll(async () => {
      mongoose.connection.db.dropCollection("cars", function(err, result) {})

    });
  
    it('create and save location successfully', async () => {
      const carData = { _id: new mongoose.Types.ObjectId(), make: "Honda", seats: 4, bodytype: "Sedan", numberplate: "TST100", 
                    colour: "black", costperhour: 10, fueltype: "Petrol", location: testLocation._id, currentBooking: null }

      const validCar = new CarModel(carData)
      const savedCar = await validCar.save();

      expect(savedCar._id).toBeDefined();
      expect(savedCar.make).toBe(carData.make);
      expect(savedCar.seats).toBe(carData.seats);
      expect(savedCar.bodytype).toBe(carData.bodytype);
      expect(savedCar.numberplate).toBe(carData.numberplate);
      expect(savedCar.colour).toBe(carData.colour);
      expect(savedCar.costperhour).toBe(carData.costperhour);
      expect(savedCar.fueltype).toBe(carData.fueltype);
      expect(savedCar.location).toBe(carData.location);
      expect(savedCar.currentBooking).not.toBeDefined();

    });

    it('create car without required field should fail', async() => {
      const invalidCarData = { _id: new mongoose.Types.ObjectId(), seats: 4, bodytype: "Sedan", numberplate: "TST100", 
      colour: "black", costperhour: 10, fueltype: "Petrol", location: testLocation._id, currentBooking: null }

      let err;

      try {
        const invalidCar = new CarModel(invalidCarData)
        const savedCarWithoutMake= await invalidCar.save();
        error = savedCarWithoutMake;
        console.log(error)
      } catch (error) {
        err = error
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.make).toBeDefined();
      
    });
});