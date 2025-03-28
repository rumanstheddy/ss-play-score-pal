const mongoose = require("mongoose");
const playScoreModel = require("../models/playscore/playscore.model");
const playscoreSchema = require("../models/playscore/playscore.schema");
const gameModel = require("../models/game/game.model");
const userModel = require("../models/user/user.model");

const calculateAverageRating = async (gameId, session, userType) => {
  const playScores = await playScoreModel.find({ gameId }).session(session);

  // console.log("userType", userType);
  // console.log(playScores);

  const userPlayScores = await Promise.all(
    playScores.map(async (playScore) => {
      const user = await userModel
        .findOne({ _id: playScore.userId })
        .session(session);
      return user && user.userType === userType ? playScore : null;
    })
  );

  // console.log(userPlayScores);

  const validPlayScores = userPlayScores.filter((ps) => ps !== null);

  // console.log(validPlayScores);

  if (validPlayScores.length === 0) return 0;

  // console.log(userType === "CRITIC" ? validPlayScores : "");
  const totalRating = validPlayScores.reduce((sum, ps) => sum + ps.rating, 0);
  // console.log(
  //   userType === "CRITIC" ? totalRating / validPlayScores.length : ""
  // );
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
    const newPlayScore = await playScoreModel.create([playScore], { session });

    const user = await userModel.findById(playScore.userId);

    // console.log("user", user);

    const { userType } = user;

    // Calculate and update the average user rating for the game
    const averageRating = await calculateAverageRating(
      playScore.gameId,
      session,
      userType
    );

    // console.log("averageRating", averageRating);

    // TODO: Fix the db updates to playscores
    const newRating = {
      [`${userType === "USER" ? "user" : "critic"}Rating`]: averageRating,
    };

    await gameModel
      .updateOne({ igdbID: playScore.gameId }, { $set: newRating }, { session })
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return newPlayScore[0];
  } catch (error) {
    // Abort the transaction on error
    console.log(error);
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

    // console.log("updatedPlayScore", updatedPlayScore);
    // console.log("userId", updatedPlayScore.userId);

    const user = await userModel.findById(updatedPlayScore.userId);

    // console.log("playScore.userId ", playScore.userId);
    // console.log("user", user);

    const { userType } = user;

    // Calculate and update the average user rating for the game
    const averageRating = await calculateAverageRating(
      updatedPlayScore.gameId,
      session,
      userType
    );

    // console.log("averageRating", averageRating);

    const newRating = {
      [`${userType === "USER" ? "user" : "critic"}Rating`]: averageRating,
    };

    await gameModel
      .updateOne(
        { igdbID: updatedPlayScore.gameId },
        { $set: newRating },
        { session }
      )
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // Abort the transaction on error
    console.log(error);
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

    // console.log("playScore", playScore);

    const result = await playScoreModel
      .deleteOne({ _id: id }, { session })
      .session(session);

    const user = await userModel.findById(playScore.userId);

    // console.log("user", user);

    const { userType } = user;

    // Calculate and update the average user rating for the game
    const averageRating = await calculateAverageRating(
      playScore.gameId,
      session,
      userType
    );

    const newRating = {
      [`${userType === "USER" ? "user" : "critic"}Rating`]: averageRating,
    };

    await gameModel
      .updateOne({ igdbID: playScore.gameId }, { $set: newRating }, { session })
      .session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    // Abort the transaction on error
    console.log(error);
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
