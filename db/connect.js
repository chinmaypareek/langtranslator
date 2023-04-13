require('dotenv').config();
const mongoose = require("mongoose");
const mongoDBURL = process.env.MONGODB_URL;

const uri = mongoDBURL;

const connectDB = () => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
