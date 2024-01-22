const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    name: { type: String, required: true },
    developer: { type: String },
    publisher: { type: String },
    summary: { type: String },
    playScores: [{ type: mongoose.Schema.ObjectId, ref: "PlayScoreModel" }],
  },
  { collection: "Game" }
);
