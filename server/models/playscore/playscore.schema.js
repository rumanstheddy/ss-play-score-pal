const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const isNotEmpty = (str) => !(!str || /^\s*$/.test(str));

module.exports = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: [true, "A valid gameId is required."],
      validate: [isNotEmpty, "gameId cannot be empty"],
    },
    userId: {
      type: ObjectId,
      ref: "UserModel",
      required: [true, "A valid userId is required."],
      immutable: true,
      validate: [isNotEmpty, "userId cannot be empty"],
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
      enum: ["YES", "ONSALE", "NO"],
      required: true,
    },
  },
  { timestamps: true },
  { collection: "PlayScore" }
);
