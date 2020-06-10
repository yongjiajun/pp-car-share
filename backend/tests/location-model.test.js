const LocationModel = require('../api/models/location');
const mongoose = require('mongoose');
const locationData = { _id: new mongoose.Types.ObjectId(), cars: [], name: "Test Garage", address: "360 Elizabeth Street, Vic, Melbourne" }


const test_uri = "mongodb://localhost:27017/pp-test"

describe('insert new location into collection', () => {
    beforeAll(async () => {
      await mongoose.connect(test_uri, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
          if (err) {
              console.error(err);
              process.exit(1);
          }
      });
    });

    afterAll(async () => {
      mongoose.connection.db.dropCollection("locations", function(err, result) {})

    });
  
    it('create and save location successfully', async () => {
      const validLocation = new LocationModel(locationData)
      const savedLocation = await validLocation.save();

      expect(savedLocation._id).toBeDefined();
      expect(savedLocation.name).toBe(locationData.name);
      expect(savedLocation.cars).toBeDefined();
      expect(savedLocation.address).toBe(locationData.address)

    });

    it('create location without required field should fail', async() => {
      const invalidLocationData = { _id: new mongoose.Types.ObjectId(), cars: [], name: "Test Garage"}
      let err;
      try {
        const invalidLocation = new LocationModel(invalidLocationData)
        const savedLocationWithoutAddress = await invalidLocation.save();
        error = savedLocationWithoutAddress;
        console.log(error)
      } catch (error) {
        err = error
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.address).toBeDefined();
      
    });
});