const gameModel = require("../models/game/game.model");

const getGame = async (id) => await gameModel.findOne({ _id: id });

const searchGame = async (searchQuery) => {
  const regexSearch = new RegExp(searchQuery, i);
  return await gameModel.find({
    $or: [
      { name: regexSearch },
      { developer: regexSearch },
      { publisher: regexSearch },
    ],
  });
};

const createGame = async (game) => await gameModel.create(game);

const updateGame = async (id, game) =>
  await gameModel.updateOne({ _id: id, $set: { ...game } });

const deleteGame = async (id) => await gameModel.deleteOne({ _id: id });

module.exports = {
  getGame,
  searchGame,
  createGame,
  updateGame,
  deleteGame,
};
