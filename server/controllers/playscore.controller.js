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

module.exports.playscore_get = async (req, res) => {
  try {
    const playscore = await playscoreService.getPlayScore(req.params.id);
    res.json(playscore);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.playscore_post = async (req, res) => {
  try {
    const playscore = {
      gameId: req.body.gameId,
      userId: req.body.userId,
      rating: req.body.rating,
      review: req.body.review,
      isRecommended: req.body.isRecommended,
      datePosted: req.body.datePosted,
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
      req.params.id,
      req.body
    );
    res.json(updatedPS);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.playscore_delete = async (req, res) => {
  try {
    const deletedPS = await playscoreService.deletePlayScore(req.params.id);
    res.json(deletedPS);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};
