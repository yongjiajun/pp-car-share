const UserModel = require('../api/models/user');
// const {MongoClient} = require("mongodb");
const mongoose = require('mongoose');
const userData = { _id: new mongoose.Types.ObjectId(), firstname: "Jonah", lastname: "Smith", email: "jonah1234@gmail.com", password: "foobar", usertype: "customer" }


const test_uri = "mongodb://localhost:27017/pp-test"

describe('insert', () => {
    // let connection;
    // let db;
  
    // beforeAll(async () => {
    //   connection = await mongoose.connect(test_uri, {
    //     useNewUrlParser: true,
    //   });
    //   db = await connection;
    // });
  
    // afterAll(async () => {
    //   await connection.close();
    //   await db.close();
    // });

    beforeAll(async () => {
      await mongoose.connect(test_uri, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
          if (err) {
              console.error(err);
              process.exit(1);
          }
      });
    });

    afterAll(async () => {
      mongoose.connection.db.dropCollection("users", function(err, result) {})

    });
  
    it('create and save user successfully', async () => {
      const validUser = new UserModel(userData)
      const savedUser = await validUser.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.firstname).toBe(userData.firstname);
      expect(savedUser.lastname).toBe(userData.lastname);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.userType).toBe(userData.userType);
    });
});