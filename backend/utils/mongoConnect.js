const mongoose = require("mongoose");

require("dotenv").config();

const Mongo_URL = process.env.Mongo_URL;

const connectDatabase = () => {
  mongoose
    .connect(Mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server`);
    });
};

module.exports = connectDatabase;