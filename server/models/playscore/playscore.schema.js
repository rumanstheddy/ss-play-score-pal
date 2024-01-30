const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    gameId: {
      type: ObjectId,
      ref: "GameModel",
      required: true,
      immutable: true,
    },
    userId: {
      type: ObjectId,
      ref: "UserModel",
      required: true,
      immutable: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "The rating cannot be lesser than 0"],
      max: [10, "The rating cannot be greater than 10"],
    },
    review: String,
    isRecommended: {
      type: String,
      enum: ["Yes", "OnSale", "No"],
      required: true,
    },
  },
  { timestamps: true },
  { collection: "PlayScore" }
);
