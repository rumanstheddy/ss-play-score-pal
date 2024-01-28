const playscoreService = require("../services/playscore.service");

module.exports.playscores_for_user_get = async (req, res) => {
  try {
    const playscores = await playscoreService.getPlayScoresByUserId(
      req.params.userId
    );
    res.json(playscores);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.playscores_for_game_get = async (req, res) => {
  try {
    const playscores = await playscoreService.getPlayScoresByGameId(
      req.params.gameId
    );
    res.json(playscores);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

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
    const updatedPS = await playscoreService.updatePlayScore(
      req.params._id,
      req.playscore
    );
    res.json(updatedPS);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.playscore_delete = async (req, res) => {
  try {
    const deletedPS = await playscoreService.deletePlayScore(req.params._id);
    res.json(deletedPS);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};
