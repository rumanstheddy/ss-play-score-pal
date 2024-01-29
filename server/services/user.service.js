const userModel = require("../models/user/user.model");

// const getUserByEmail = async (email) =>
//   await userModel.findOne({ email: email });

const getUser = async (id) => {
  const result = await userModel.findOne({ _id: id });

  if (result === null) throw new Error(`No user found with Id: ${id}`);

  return result;
};

const getAllUsers = async () => await userModel.find();

const searchUser = async (searchQuery) => {
  const regexSearch = new RegExp(searchQuery, "i");
  const result = await userModel.find({
    $or: [
      { firstName: regexSearch },
      { lastName: regexSearch },
      { email: regexSearch },
    ],
  });

  if (result.length === 0)
    throw new Error(
      `Could not find any results for the value: '${searchQuery}'`
    );

  return result;
};

const createUser = async (user) => await userModel.create(user);

const updateUser = async (id, user) =>
  await userModel.updateOne({ _id: id }, { $set: { ...user } });

const deleteUser = async (id) => {
  const result = await userModel.deleteOne({ _id: id });

  if (result.deletedCount === 0)
    throw new Error(`No user found with Id: ${id}`);

  return result;
};

module.exports = {
  getUser,
  createUser,
  getAllUsers,
  searchUser,
  updateUser,
  deleteUser,
};
