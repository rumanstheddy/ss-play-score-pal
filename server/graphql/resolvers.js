const { GraphQLError } = require("graphql");

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
  getGame,
  getAllGames,
  searchGame,
  createGame,
  updateGame,
  deleteGame,
} = require("../services/game.service");

const { login } = require("../services/auth.service");

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

    async games() {
      return await getAllGames();
    },

    async game(_, { id }) {
      return await getGame(id);
    },

    async searchGames(_, { searchQuery }) {
      return await searchGame(searchQuery);
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
              code: "BAD_USER_INPUT",
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

    async updateGame(_, { id, game }) {
      return await updateGame(id, game);
    },

    async deleteGame(_, { id }) {
      return await deleteGame(id);
    },
  },
};
