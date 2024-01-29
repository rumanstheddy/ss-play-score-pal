const gameService = require("../services/game.service");

module.exports.games_get = async (req, res) => {
  try {
    const games = await gameService.getGames();
    res.json(games);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.game_get = async (req, res) => {
  try {
    const game = await gameService.getGame(req.params.id);
    res.json(game);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.game_search_get = async (req, res) => {
  try {
    const searchResult = await gameService.searchGame(
      req.params.keyword.toLocaleLowerCase()
    );

    res.json(searchResult);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
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
    res.json(createdGame);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.game_put = async (req, res) => {
  try {
    const updatedGame = await gameService.updateGame(req.params.id, req.body);
    res.json(updatedGame);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};

module.exports.game_delete = async (req, res) => {
  try {
    const deletedGame = await gameService.deleteGame(req.params.id);
    res.json(deletedGame);
  } catch (error) {
    // TODO todo: error handling
    console.log(error.message);
  }
};
