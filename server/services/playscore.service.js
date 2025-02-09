const playScoreModel = require("../models/playscore/playscore.model");
const playscoreSchema = require("../models/playscore/playscore.schema");

const getPlayScore = async (id) => await playScoreModel.findOne({ _id: id });

const getAllPlayScores = async () => playScoreModel.find();

const getPlayScoresByGameId = async (gameId) =>
  await playScoreModel.find({ gameId: gameId });

const getPlayScoresByUserId = async (userId) =>
  await playScoreModel.find({ userId: userId });

const createPlayScore = async (playScore) => {
  const playScoreExists = await playScoreModel.findOne({
    userId: playScore.userId,
    gameId: playScore.gameId,
  });

  if (!!playScoreExists) {
    throw new Error("You have already reviewed this game.");
  }

  return await playScoreModel.create(playScore);
};

const updatePlayScore = async (psId, playScore) => {
  return await playScoreModel.updateOne(
    {
      _id: psId,
    },
    {
      $set: {
        rating: playScore.rating,
        review: playScore.review,
        isRecommended: playScore.isRecommended,
      },
    }
  );
};

const deletePlayScore = async (id) => playScoreModel.deleteOne({ _id: id });

// Mongoose Middleware
playscoreSchema.post("save", (doc) => {
  console.log("Playscore succesfully created!", doc);
});

module.exports = {
  createPlayScore,
  getPlayScore,
  updatePlayScore,
  getAllPlayScores,
  deletePlayScore,
  getPlayScoresByGameId,
  getPlayScoresByUserId,
};
