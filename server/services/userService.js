const userModel = require("../models/user/user.model");
const userSchema = require("../models/user/user.schema");

// const getUserByEmail = async (email) =>
//   await userModel.findOne({ email: email });

const getUser = async (id) => await userModel.findOne({ _id: id });

const getAllUsers = async () => await userModel.find();

const searchUser = async (searchQuery) => {
  const regexSearch = new RegExp(searchQuery, i);
  return await userModel.find({
    $or: [
      { firstName: regexSearch },
      { lastName: regexSearch },
      { email: regexSearch },
    ],
  });
};

const createUser = async (user) => await userModel.create(user);

const updateUser = async (email, user) =>
  await userModel.updateOne({ email: email }, { $set: { ...user } });

const deleteUser = async (id) => await userModel.deleteOne({ _id: id });

// Mongoose Middleware
userSchema.post("save", function (doc) {
  console.log("Created a new user!", doc);
});

module.exports = {
  getUser,
  createUser,
  getAllUsers,
  searchUser,
  updateUser,
  deleteUser,
};
