const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
const playScoreModel = require("../models/playscore/playscore.model");
const gameModel = require("../models/game/game.model");
const userModel = require("../models/user/user.model");

const {
  createPlayScore,
  getPlayScore,
  updatePlayScore,
  deletePlayScore,
  getPlayScoresByGameId,
  getPlayScoresByUserId,
} = require("../services/playscore.service");

const {
  getUser,
  createUser,
  getAllUsers,
  searchUser,
  updateUser,
  deleteUser,
} = require("../services/user.service");

const {
  getGameByIgdbID,
  createGame,
  updateGameByIgdbID,
} = require("../services/game.service");

const { login } = require("../services/auth.service");

// const calculateAverageUserRating = async (gameId, session) => {
//   const playScores = await playScoreModel.find({ gameId }).session(session);

//   // console.log(playScores);

//   const userPlayScores = await Promise.all(
//     playScores.map(async (playScore) => {
//       const user = await userModel
//         .findOne({ _id: playScore.userId })
//         .session(session);
//       console.log(user === null ? playScore._id : "");
//       return user && user.userType === "USER" ? playScore : null;
//     })
//   );

//   // console.log(userPlayScores);

//   // const validPlayScores = userPlayScores.filter((ps) => ps !== null);

//   // if (validPlayScores.length === 0) return 0;

//   const totalRating = userPlayScores.reduce((sum, ps) => sum + ps.rating, 0);
//   return totalRating / userPlayScores.length;
// };

// const calculateUserRatings = async () => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Fetch all unique gameIds from the PlayScore collection
//     const uniqueGameIds = await playScoreModel
//       .distinct("gameId")
//       .session(session);

//     // Iterate over each unique gameId
//     for (const gameId of uniqueGameIds) {
//       // Calculate the average user rating
//       const averageRating = await calculateAverageUserRating(gameId, session);

//       // Create or update the Game document
//       await gameModel
//         .updateOne(
//           { igdbID: gameId }, // Use igdbID as the unique identifier
//           { $set: { userRating: averageRating } },
//           { upsert: true, session } // Create the document if it doesn't exist
//         )
//         .session(session);
//     }

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     return "User ratings calculated and updated successfully!";
//   } catch (error) {
//     // Abort the transaction on error
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

module.exports = {
  Query: {
    async playScore(_, { id }) {
      return await getPlayScore(id);
    },

    async playScoresByGameId(_, { gameId }) {
      return await getPlayScoresByGameId(gameId);
    },

    async playScoresByUserId(_, { userId }) {
      return await getPlayScoresByUserId(userId);
    },

    async users() {
      return await getAllUsers();
    },

    async user(_, { id }) {
      return await getUser(id);
    },

    async searchUsers(_, { searchQuery }) {
      return await searchUser(searchQuery);
    },

    async game(_, { igdbID }) {
      return await getGameByIgdbID(igdbID);
    },

    async login(_, { email, password }) {
      return await login(email, password);
    },
  },

  Mutation: {
    async createPlayScore(_, { playScore }) {
      return await createPlayScore(playScore);
    },

    async updatePlayScore(_, { id, playScore }) {
      return await updatePlayScore(id, playScore);
    },

    async deletePlayScore(_, { id }) {
      return await deletePlayScore(id);
    },

    async signup(_, { user }) {
      const searchResult = await searchUser(user.email);
      if (searchResult.length > 0) {
        throw new GraphQLError(
          "An account with that e-mail address already exists!",
          {
            extensions: {
              code: "USER_ALREADY_EXISTS",
            },
          }
        );
      }

      if (user.password.length < 6) {
        throw new GraphQLError(
          "Your password should be at least 6 characters in length!",
          {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          }
        );
      }

      return await createUser(user);
    },

    async updateUser(_, { id, user }) {
      return await updateUser(id, user);
    },

    async deleteUser(_, { id }) {
      return await deleteUser(id);
    },

    async createGame(_, { game }) {
      return await createGame(game);
    },

    async updateGame(_, { igdbID, game }) {
      return await updateGameByIgdbID(igdbID, game);
    },

    // calculateUserRatings,
  },
};
