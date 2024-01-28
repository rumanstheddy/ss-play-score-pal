const gameModel = require("../models/game/game.model");
const gameSchema = require("../models/game/game.schema");

const getGame = async (id) => await gameModel.findOne({ _id: id });

const getGames = async () => await gameModel.find();

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

// Mongoose Middleware
gameSchema.post("save", function (doc) {
  console.log("Created a new game entry!", doc);
});

module.exports = {
  getGame,
  getGames,
  searchGame,
  createGame,
  updateGame,
  deleteGame,
};
