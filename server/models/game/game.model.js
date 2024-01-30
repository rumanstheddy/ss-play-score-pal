const mongoose = require("mongoose");

const gameSchema = require("./game.schema");

// Mongoose Middleware
gameSchema.post("save", function (doc) {
  console.log("Created a new game entry!", doc);
});

// Mongoose Middleware for validating an entry before updating it
gameSchema.pre("updateOne", async function (next) {
  this.options.runValidators = true;
  next();
});

module.exports = mongoose.model("GameModel", gameSchema);
