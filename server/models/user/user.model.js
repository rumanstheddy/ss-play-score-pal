const mongoose = require("mongoose");
const userSchema = require("./user.schema");
const bcrypt = require("bcrypt");

// Mongoose Middleware for hashing the password before saving the entry
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error.message);
  }
});

// Mongoose Middleware for hashing the password before updating an entry
userSchema.pre("updateOne", async function (next) {
  try {
    this.options.runValidators = true;

    const update = this.getUpdate().$set;
    if (update.password) {
      console.log(update);
      const salt = await bcrypt.genSalt();
      update.password = await bcrypt.hash(update.password, salt);
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
  }
  throw Error("incorrect e-mail address or password");
};

module.exports = mongoose.model("UserModel", userSchema, "users");
