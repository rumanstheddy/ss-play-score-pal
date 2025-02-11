const userModel = require("../models/user/user.model");

const login = async (email, password) => await userModel.login(email, password);

module.exports = {
  login,
};
