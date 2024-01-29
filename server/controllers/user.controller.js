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
    const user = await userService.getUser(req.params.id);
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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
      isSSreviewer: req.body.isSSreviewer,
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
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.user_delete = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};
