const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    name: { type: String, required: true },
    developer: String,
    publisher: String,
    releaseDate: new Date(),
    summary: { type: String, required: true },
    genre: [String],
  },
  { collection: "Game" }
);
