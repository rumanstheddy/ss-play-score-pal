const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["User", "Admin"], default: "User" },
    playScores: [
      { type: mongoose.SchemaTypes.ObjectId, ref: "PlayScoreModel" },
    ],
    isSSreviewer: { type: Boolean, default: false },
  },
  { collection: "User" }
);
