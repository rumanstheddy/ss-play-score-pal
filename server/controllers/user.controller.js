const userService = require("../services/user.service");

const handleErrors = (err) => {
  if (err.code && err.code === 11000) {
    return "An account with that e-mail address already exists.";
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
      isVerified: req.body.isVerified,
    };

    const createdUser = await userService.createUser(user);
    res.json(createdUser);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.json(errorMsg);
  }
};

module.exports.user_put = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    // todo: password validation after updating
    const errorMsg = handleErrors(err);
    res.json(errorMsg);
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
