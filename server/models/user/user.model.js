const mongoose = require("mongoose");
const userSchema = require("./user.schema");

// Mongoose Middleware
userSchema.pre("pre", async (next) => {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post("save", (doc) => {
  console.log("Created a new user!", doc);
});

userSchema.statics.login = async (email, password) => {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error("incorrect password");
  }
  throw Error("incorrect e-mail address");
};

module.exports = mongoose.model("UserModel", userSchema);
