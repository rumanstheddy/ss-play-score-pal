const playScoreModel = require("../../models/playscore/playscore.model");

const createPlayScore = async (playScore) =>
  await playScoreModel.create(playScore);

const getPlayScoreById = async (id) =>
  await playScoreModel.findOne({ _id: id });

const editPlayScore = async (psId, playScore) => {
  return await playScoreModel.updateOne({
    _id: psId,
    $set: {
      rating: playScore.rating,
      review: playScore.review,
      isRecommended: playScore.isRecommended,
    },
  });
};

const getAllPlayScores = async () => playScoreModel.find();

const deletePlayScore = async (id) => playScoreModel.deleteOne({ _id: id });

const getPlayScoresByGameId = async (gameId) =>
  await playScoreModel.find({ gameId: gameId });

const getPlayScoresByUserId = async (userId) =>
  await playScoreModel.find({ userId: userId });

module.exports = {
  createPlayScore,
  getPlayScoreById,
  editPlayScore,
  getAllPlayScores,
  deletePlayScore,
  getPlayScoresByGameId,
  getPlayScoresByUserId,
};
