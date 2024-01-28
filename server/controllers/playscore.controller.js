const playscoreService = require("../services/playscore.service");

// ! Create get methods for playscore (users and games)

module.exports.playscore_post = async (req, res) => {
  try {
    const playscore = {
      gameId: req.gameId,
      userId: req.userId,
      rating: req.rating,
      review: req.review,
      isRecommended: req.isRecommended,
    };

    const createdPS = await playscoreService.createPlayScore(playscore);
    res.json(createdPS);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.playscore_put = async (req, res) => {
  try {
    const updatedPlayscore = await playscoreService.updatePlayScore(
      req.params._id,
      req.playscore
    );
    res.json(updatedPlayscore);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.playscore_delete = async (req, res) => {
  try {
    const deletedPlayscore = await playscoreService.deletePlayScore(
      req.params._id
    );
    res.json(deletedPlayscore);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};
