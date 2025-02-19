const userService = require("../services/user.service");

const handleErrors = (err) => {
  if (err.code && err.code === 11000) {
    return "An account with that e-mail address already exists.";
  }

  if (err.message && err.message.includes("Cast to ObjectId failed")) {
    return `No user found with Id: ${err.value}`;
  }

  if (err.message && err.message.includes("No user found")) {
    return err.message;
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
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports.user_get = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.user_search_get = async (req, res) => {
  try {
    const searchResult = await userService.searchUser(
      req.params.keyword.toLocaleLowerCase()
    );

    res.status(200).json(searchResult);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Internal Server Error" });
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
    res.status(201).json(createdUser);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.user_put = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(404).json({ error: errorMsg });
  }
};

module.exports.user_delete = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(404).json({ error: errorMsg });
  }
};
