const mongoose = require("mongoose");
const playScoreModel = require("../models/playscore/playscore.model");
const playscoreSchema = require("../models/playscore/playscore.schema");
const gameModel = require("../models/game/game.model");
const userModel = require("../models/user/user.model");

const calculateAverageUserRating = async (gameId, session) => {
  const playScores = await playScoreModel.find({ gameId }).session(session);

  const userPlayScores = await Promise.all(
    playScores.map(async (playScore) => {
      const user = await userModel.findById(playScore.userId).session(session);
      return user && user.userType === "USER" ? playScore : null;
    })
  );

  const validPlayScores = userPlayScores.filter((ps) => ps !== null);

  if (validPlayScores.length === 0) return 0;

  const totalRating = validPlayScores.reduce((sum, ps) => sum + ps.rating, 0);
  return totalRating / validPlayScores.length;
};

const getPlayScore = async (id) => await playScoreModel.findOne({ _id: id });

const getAllPlayScores = async () => playScoreModel.find();

const getPlayScoresByGameId = async (gameId) =>
  await playScoreModel.find({ gameId: gameId });

const getPlayScoresByUserId = async (userId) =>
  await playScoreModel.find({ userId: userId });

const createPlayScore = async (playScore) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const playScoreExists = await playScoreModel
      .findOne({
        userId: playScore.userId,
        gameId: playScore.gameId,
      })
      .session(session);

    if (playScoreExists) {
      throw new Error("You have already reviewed this game.");
    }

    // Create the PlayScore
    const newPlayScore = await playScoreModel.create(playScore, { session });

    // Calculate and update the average user rating for the game
    const averageRating = await calculateAverageUserRating(
      playScore.gameId,
      session
    );
    await gameModel
      .updateOne(
        { igdbID: playScore.gameId },
        { $set: { userRating: averageRating } },
        { session }
      )
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return newPlayScore[0];
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updatePlayScore = async (psId, playScore) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await playScoreModel
      .updateOne(
        { _id: psId },
        {
          $set: {
            rating: playScore.rating,
            review: playScore.review,
            isRecommended: playScore.isRecommended,
          },
        },
        { session }
      )
      .session(session);

    if (result.modifiedCount === 0) {
      throw new Error(`No playscore found with Id: ${psId}`);
    }

    // Find the gameId associated with the updated PlayScore
    const updatedPlayScore = await playScoreModel
      .findById(psId)
      .session(session);
    if (!updatedPlayScore) {
      throw new Error("PlayScore not found.");
    }

    // Calculate and update the average user rating for the game
    const averageRating = await calculateAverageUserRating(
      updatedPlayScore.gameId,
      session
    );
    await gameModel
      .updateOne(
        { igdbID: updatedPlayScore.gameId },
        { $set: { userRating: averageRating } },
        { session }
      )
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deletePlayScore = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const playScore = await playScoreModel.findById(id).session(session);
    if (!playScore) {
      throw new Error(`No playscore found with Id: ${id}`);
    }

    const result = await playScoreModel
      .deleteOne({ _id: id }, { session })
      .session(session);

    // Calculate and update the average user rating for the game
    const averageRating = await calculateAverageUserRating(
      playScore.gameId,
      session
    );
    await gameModel
      .updateOne(
        { igdbID: playScore.gameId },
        { $set: { userRating: averageRating } },
        { session }
      )
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

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
