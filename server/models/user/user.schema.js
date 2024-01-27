const mongoose = require("mongoose");
const { isEmail } = require("validator");

module.exports = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your First Name"],
    },
    lastName: { type: String, required: [true, "Please enter your Last Name"] },
    email: {
      type: String,
      required: [true, "Please enter an e-mail address"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid e-mail address"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Your password should be at least 6 characters in length"],
    },
    userType: { type: String, enum: ["User", "Admin"], default: "User" },
    isSSreviewer: { type: Boolean, default: false },
  },
  { collection: "User" }
);
