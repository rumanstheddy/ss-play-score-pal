const userModel = require("../../models/user/user.model");

const getByUserEmail = async (email) =>
  await userModel.findOne({ email: email });

const createUser = async (user) => await userModel.create(user);

const getAllUsers = async () => await userModel.find();

// const getUserByCredentials = async (userId, password) =>
//   await userModel.findOne({ userId: userId, password: password });

const getUserBySearch = async (searchQuery) => {
  const regexSearch = new RegExp(searchQuery, i);
  return await userModel.find({ email: regexSearch });
};

const updateUser = async (email, userInfo) => {
  return userModel.updateOne({ email: email }, { $set: { ...userInfo } });
};

const deleteUserById = async (id) => await userModel.deleteOne({ _id: id });

module.exports = {
  getByUserEmail,
  createUser,
  getAllUsers,
  getUserBySearch,
  updateUser,
  deleteUserById,
};
