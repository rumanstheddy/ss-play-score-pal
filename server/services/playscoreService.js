const playScoreModel = require("../models/playscore/playscore.model");

const getPlayScore = async (id) =>
  await playScoreModel.findOne({ _id: id });

const getAllPlayScores = async () => playScoreModel.find();

const getPlayScoresByGameId = async (gameId) =>
  await playScoreModel.find({ gameId: gameId });

const getPlayScoresByUserId = async (userId) =>
  await playScoreModel.find({ userId: userId });

const createPlayScore = async (playScore) =>
  await playScoreModel.create(playScore);

const updatePlayScore = async (psId, playScore) => {
  return await playScoreModel.updateOne({
    _id: psId,
    $set: {
      rating: playScore.rating,
      review: playScore.review,
      isRecommended: playScore.isRecommended,
    },
  });
};

const deletePlayScore = async (id) => playScoreModel.deleteOne({ _id: id });

module.exports = {
  createPlayScore,
  getPlayScore,
  updatePlayScore,
  getAllPlayScores,
  deletePlayScore,
  getPlayScoresByGameId,
  getPlayScoresByUserId,
};
