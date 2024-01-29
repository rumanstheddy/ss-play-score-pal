const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name of the game"],
    },
    developer: String,
    publisher: String,
    releaseDate: Date,
    summary: {
      type: String,
      required: [true, "Please enter a summary for the game"],
    },
    genre: [String],
  },
  { collection: "Game" }
);
