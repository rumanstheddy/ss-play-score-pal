const mongoose = require("mongoose");
const { isDate } = require("validator");

const isNotEmpty = (str) => !(!str || /^\s*$/.test(str));

module.exports = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Please enter the name of the game"],
    },
    developer: String,
    publisher: String,
    releaseDate: {
      type: Date,
      validate: [isDate, "Please enter an appropriate date"],
    },
    summary: {
      type: String,
      required: true,
      validate: [isNotEmpty, "The summary cannot be empty"],
    },
    genre: [{ type: String }],
  },
  { collection: "Game" }
);
