require("dotenv").config();
const jwt = require("jsonwebtoken");

const userService = require("../services/user.service");

const User = require("../models/user/user.model");

const maxAge = 1000 * 60 * 60 * 24;
const createToken = (id) => {
  // * Setting the token validity for 1 day
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  if (err.code && err.code === 11000) {
    return "An account with that e-mail address already exists.";
  }

  if (err.message && err.message.includes("incorrect")) {
    return "The email address or password you entered is incorrect. Please try again.";
  }

  let errorObj = [];

  Object.values(err.errors).forEach((child) => {
    const obj = {
      field: child.properties.path,
      message: child.properties.message,
    };
    errorObj.push(obj);
  });

  return errorObj;
};

module.exports.signup = async (req, res) => {
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
      isVerified: req.body.isVerified,
    };

    const createdUser = await userService.createUser(user);
    const token = createToken(createdUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(201).json({ user: createdUser._id });
  } catch (error) {
    const errMsg = handleErrors(error);
    res.status(400).json({ error: errMsg });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errMsg = handleErrors(error);
    res.status(401).json({ error: errMsg });
  }
};

// module.exports = (app) => {
//   app.get("/set-cookies", (req, res) => {
//     res.setHeader("set-cookie", "newUser=true");
//     res.cookie("newUser", true);
//     res.cookie("isEmployee", false, {
//       maxAge: 1000 * 60 * 60 * 24,
// ** The cookie cannot be accessed now using JS
//       httpOnly: true,
// ** The cookie can only be accessed on https connections only
//       secure: true,
//     });
//   });
// };
