const mongoose = require("mongoose");
const userSchema = require("./user.schema");
const bcrypt = require("bcrypt");

// Mongoose Middleware
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error.message);
  }
});

userSchema.post("save", function (doc) {
  console.log("Created a new user!", doc);
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error("incorrect password");
  }
  throw Error("incorrect e-mail address");
};

module.exports = mongoose.model("UserModel", userSchema);
