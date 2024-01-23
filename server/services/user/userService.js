const userModel = require("../../models/user/user.model");

const getByUserId = async (userId) =>
  await userModel.findOne({ userId: userId });

const createUser = async (user) => await userModel.create(user);

const getAllUsers = async () => await userModel.find();

// const getUserByCredentials = async (userId, password) =>
//   await userModel.findOne({ userId: userId, password: password });

const getUserBySearch = async (searchQuery) => {
  const regexSearch = new RegExp(searchQuery, i);
  return await userModel.find({ userId: regexSearch });
};

const updateUser = async (userId, userInfo) => {
  return userModel.updateOne({ userId: userId }, { $set: { ...userInfo } });
};

const deleteUserById = async (id) => await userModel.deleteOne({ _id: id });

module.exports = {
  getByUserId,
  createUser,
  getAllUsers,
  getUserBySearch,
  updateUser,
  deleteUserById,
};
