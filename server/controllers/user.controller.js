const userService = require("../services/user.service");

module.exports.users_get = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.user_get = async (req, res) => {
  try {
    const user = await userService.getUser(req.params._id);
    res.json(user);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.user_search_get = async (req, res) => {
  try {
    const searchResult = await userService.searchUser(
      req.params.keyword.toLocaleLowerCase()
    );

    res.json(searchResult);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.user_post = async (req, res) => {
  try {
    const user = {
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      password: req.password,
      userType: req.userType,
      isSSreviewer: req.isSSreviewer,
    };

    const createdUser = await userService.createUser(user);
    res.json(createdUser);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.user_put = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params._id, req.user);
    res.json(updatedUser);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.user_delete = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params._id);
    res.json(deletedUser);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};
