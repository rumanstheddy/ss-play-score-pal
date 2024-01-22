const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  gameId: { type: ObjectId, ref: "GameModel", required: true },
  rating: { type: Number, required: true },
  review: { type: String },
  recommended: { type: String, enum: ["Yes", "OnSale", "No"], required: true },
});
