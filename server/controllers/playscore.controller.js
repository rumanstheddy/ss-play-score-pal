const playscoreService = require("../services/playscore.service");

const handleErrors = (err) => {
  if (err.code && err.code === 11000) {
    return "This user has already added their Playscore for this game.";
  }

  if (
    err.message &&
    err.message.includes("Cast to ObjectId failed") &&
    !err.message.includes("PlayScoreModel validation failed")
  ) {
    if (err.path === "userId") return `No user found with Id: ${err.value}`;
    if (err.path === "gameId") return `No game found with Id: ${err.value}`;

    return `No playscore found with Id: ${err.value}`;
  }

  let errorObj = [];

  Object.values(err.errors).forEach((child) => {
    const obj = {};

    obj.field = child.path;
    obj.message = `Expected ${child.kind}, got ${child.valueType} of value '${child.value}'`;

    if (child.properties) {
      obj.field = child.properties.path;
      obj.message = child.properties.message;
    }
    errorObj.push(obj);
  });

  return errorObj;
};

module.exports.playscores_for_user_get = async (req, res) => {
  try {
    const playscores = await playscoreService.getPlayScoresByUserId(
      req.params.userId
    );
    res.status(200).json(playscores);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.playscores_for_game_get = async (req, res) => {
  try {
    const playscores = await playscoreService.getPlayScoresByGameId(
      req.params.gameId
    );
    res.status(200).json(playscores);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.playscore_get = async (req, res) => {
  try {
    const playscore = await playscoreService.getPlayScore(req.params.id);
    res.status(200).json(playscore);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
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
    res.status(201).json(createdPS);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.playscore_put = async (req, res) => {
  try {
    const updatedPS = await playscoreService.updatePlayScore(
      req.params.id,
      req.body
    );
    res.json(updatedPS);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(404).json({ error: errorMsg });
  }
};

module.exports.playscore_delete = async (req, res) => {
  try {
    const deletedPS = await playscoreService.deletePlayScore(req.params.id);
    res.json(deletedPS);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(404).json({ error: errorMsg });
  }
};
