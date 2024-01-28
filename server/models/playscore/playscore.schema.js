const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    gameId: { type: ObjectId, ref: "GameModel", required: true },
    userId: { type: ObjectId, ref: "UserModel", required: true },
    rating: {
      type: Number,
      required: true,
      min: [0, "The value cannot be lesser than 0"],
      max: [10, "The value cannot be greater than 10"],
    },
    review: String,
    isRecommended: {
      type: String,
      enum: ["Yes", "OnSale", "No"],
      required: true,
    },
  },
  { collection: "PlayScore" }
);
