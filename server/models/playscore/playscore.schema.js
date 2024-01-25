const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    gameId: { type: ObjectId, ref: "GameModel", required: true },
    userId: { type: ObjectId, ref: "UserModel", required: true },
    rating: { type: Number, required: true },
    review: String,
    isRecommended: {
      type: String,
      enum: ["Yes", "OnSale", "No"],
      required: true,
    },
  },
  { collection: "PlayScore" }
);
