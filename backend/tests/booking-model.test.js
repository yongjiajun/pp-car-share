const CarModel = require('../api/models/car');
const LocationModel = require('../api/models/location');
const UserModel = require('../api/models/user');
const BookingModel = require('../api/models/booking');
const mongoose = require('mongoose');

const test_uri = "mongodb://localhost:27017/pp-test"

let testLocation, testCar, testUser;

describe('insert new car into collection', () => {
    beforeAll(async () => {
      await mongoose.connect(test_uri, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
          if (err) {
              console.error(err);
              process.exit(1);
          }
      });

      const userData = { _id: new mongoose.Types.ObjectId(), firstname: "Jonah", lastname: "Smith", email: "jonah1234@gmail.com", password: "foobar", usertype: "customer" }
      const validUser = new UserModel(userData)
      testUser = await validUser.save();

      const locationData = { _id: new mongoose.Types.ObjectId(), cars: [], name: "Test Garage", address: "30 Swanston Street, Vic, Melbourne" }
      const location = new LocationModel(locationData);
      testLocation = await location.save();

      const carData = { _id: new mongoose.Types.ObjectId(), make: "Honda", seats: 4, bodytype: "Sedan", numberplate: "TST100", 
                    colour: "black", costperhour: 10, fueltype: "Petrol", location: testLocation._id, currentBooking: null }

      const validCar = new CarModel(carData)
      testCar = await validCar.save();

    });

    afterAll(async () => {
      mongoose.connection.db.dropCollection("cars", function(err, result) {})
      mongoose.connection.db.dropCollection("locations", function(err, result) {})
      mongoose.connection.db.dropCollection("bookings", function(err, result) {})
      mongoose.connection.db.dropCollection("users", function(err, result) {})

    });
  
    it('create and save booking successfully', async () => {
      let bookingData = { _id: new mongoose.Types.ObjectId(), user: testUser._id, car: testCar._id, 
        bookedtime: new Date(), pickuptime: new Date(), 
        returntime: new Date(3.6 * 10^6), cost: 15, location: testLocation._id, status: "Confirmed" }

      const validBooking = new BookingModel(bookingData);
      const savedBooking = await validBooking.save();

      expect(savedBooking._id).toBeDefined();
      expect(savedBooking.user).toBe(bookingData.user);
      expect(savedBooking.car).toBe(bookingData.car);
      expect(savedBooking.bookedtime).toBe(bookingData.bookedtime);
      expect(savedBooking.pickuptime).toBe(bookingData.pickuptime);
      expect(savedBooking.returntime).toBe(bookingData.returntime);
      expect(savedBooking.cost).toBe(bookingData.cost);
      expect(savedBooking.location).toBe(bookingData.location);
      expect(savedBooking.status).toBe(bookingData.status);

    });

    it('create car without required field should fail', async() => {
      let invalidBookingData = { _id: new mongoose.Types.ObjectId(), user: testUser._id, car: testCar._id, 
        pickuptime: new Date(), returntime: new Date(3.6 * 10^6), cost: 15, location: testLocation._id, status: "Confirmed" }

      let err;

      try {
        const invalidBooking = new BookingModel(invalidBookingData)
        const savedBookingWithoutBookedTime= await invalidBooking.save();
        error = savedBookingWithoutBookedTime;
        console.log(error)
      } catch (error) {
        err = error
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.bookedtime).toBeDefined();
      
    });
});