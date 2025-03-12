const mongoose = require("mongoose");
const { isEmail } = require("validator");

const isNotEmpty = (str) => !(!str || /^\s*$/.test(str));

module.exports = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your First Name"],
      validate: [isNotEmpty, "Your First Name cannot be empty"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your Last Name"],
      validate: [isNotEmpty, "Your Last Name cannot be empty"],
    },
    email: {
      type: String,
      required: [true, "Please enter an e-mail address"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid e-mail address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Your password should be at least 6 characters in length"],
    },
    userType: {
      type: String,
      enum: ["USER", "CRITIC", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
  { collection: "User" }
);
