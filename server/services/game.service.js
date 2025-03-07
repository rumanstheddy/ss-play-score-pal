const gameModel = require("../models/game/game.model");

// const getGame = async (id) => {
//   const result = await gameModel.findOne({ _id: id });

//   if (result === null) throw new Error(`No game found with Id: ${id}`);

//   return result;
// };

const getGameByIgdbID = async (igdbID) => {
  const result = await gameModel.findOne({ igdbID });

  if (result === null) throw new Error(`No game found with IGDB ID: ${igdbID}`);

  return result;
};

// const getAllGames = async () => await gameModel.find();

// const searchGame = async (searchQuery) => {
//   const regexSearch = new RegExp(searchQuery, "i");
//   return await gameModel.find({
//     $or: [
//       { name: regexSearch },
//       { developer: regexSearch },
//       { publisher: regexSearch },
//     ],
//   });
// };

const createGame = async (game) => await gameModel.create(game);

// const updateGame = async (id, game) =>
//   await gameModel.updateOne({ _id: id }, { $set: { ...game } });

// const deleteGame = async (id) => {
//   const result = await gameModel.deleteOne({ _id: id });

//   if (result.deletedCount === 0)
//     throw new Error(`No game found with Id: ${id}`);

//   return result;
// };

const updateGameByIgdbID = async (igdbID, game) =>
  await gameModel.updateOne({ igdbID }, { $set: { ...game } });

// module.exports = {
//   getGame,
//   getAllGames,
//   searchGame,
//   createGame,
//   updateGame,
//   deleteGame,
// };

module.exports = {
  getGameByIgdbID,
  createGame,
  updateGameByIgdbID,
};
