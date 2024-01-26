const mongoose = require("mongoose");

module.exports = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    userType: { type: String, enum: ["User", "Admin"], default: "User" },
    isSSreviewer: { type: Boolean, default: false },
  },
  { collection: "User" }
);
