const mongoose = require("mongoose");

const playScoreSchema = require("./playscore.schema");

playScoreSchema.index({ gameId: 1, userId: 1 }, { unique: true });

// Mongoose Middleware for validating an entry before updating it
// Also adds a new field to the schema to show the entry was edited
playScoreSchema.pre("updateOne", async function (next) {
  this.options.runValidators = true;
  next();
});

module.exports = mongoose.model("PlayScoreModel", playScoreSchema, "playscores");
