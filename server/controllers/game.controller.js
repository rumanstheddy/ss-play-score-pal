const gameService = require("../services/game.service");

const handleErrors = (err) => {
  if (err.code && err.code === 11000) {
    return "That game entry you've entered already exists.";
  }

  if (err.message && err.message.includes("Cast to ObjectId failed")) {
    return `No game found with Id: ${err.value}`;
  }

  if (err.message && err.message.includes("No game found")) {
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

module.exports.games_get = async (req, res) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports.game_get = async (req, res) => {
  try {
    const game = await gameService.getGame(req.params.id);
    res.status(200).json(game);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.game_search_get = async (req, res) => {
  try {
    const searchResult = await gameService.searchGame(
      req.params.keyword.toLocaleLowerCase()
    );

    res.status(200).json(searchResult);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports.game_post = async (req, res) => {
  try {
    const game = {
      name: req.body.name,
      developer: req.body.developer,
      publisher: req.body.publisher,
      releaseDate: req.body.releaseDate,
      summary: req.body.summary,
      genre: req.body.genre,
    };

    const createdGame = await gameService.createGame(game);
    res.status(201).json(createdGame);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(400).json({ error: errorMsg });
  }
};

module.exports.game_put = async (req, res) => {
  try {
    const updatedGame = await gameService.updateGame(req.params.id, req.body);
    res.status(200).json(updatedGame);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(404).json({ error: errorMsg });
  }
};

module.exports.game_delete = async (req, res) => {
  try {
    const deletedGame = await gameService.deleteGame(req.params.id);
    res.json(deletedGame);
  } catch (err) {
    const errorMsg = handleErrors(err);
    res.status(404).json({ error: errorMsg });
  }
};
