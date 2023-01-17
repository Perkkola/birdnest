const mongoose = require("mongoose");

//A schema for creating documents to the MongoDB database
const schema = new mongoose.Schema({
  pilotId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  closestDistance: {
    type: Number,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

const Pilot = mongoose.model("Pilot", schema);

module.exports = Pilot;
