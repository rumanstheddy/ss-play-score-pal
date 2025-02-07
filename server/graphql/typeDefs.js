module.exports = `
  enum Recommendation {
    YES
    ONSALE
    NO
  }

  type PlayScore {
    gameId: String!
    userId: String!
    rating: Float!
    review: String
    isRecommended: [Recommendation]!
    createdAt: String
    updatedAt: String
  }

  enum UserType {
    USER
    ADMIN
  }

  type User {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    userType: [UserType]
    isVerified: Boolean
    createdAt: String
  }

  type Game {
    name: String!
    developer: String
    publisher: String
    releaseDate: Int
    summary: String
    genre: [String]
  }

  type Query {
    playScore(id: ID!): PlayScore
    playScoresByGameId(gameId: String!): [PlayScore]
    playScoresByUserId(userId: String!): [PlayScore]
    users: [User]
    user(id: ID!): User
    searchUsers(searchQuery: String!): [User]
    games: [Game]
    game(id: ID!): Game
    searchGames(searchQuery: String!): [Game]
  }

  input PlayScoreInput {
    gameId: String!
    userId: String!
    rating: Float!
    review: String
    isRecommended: [Recommendation]!
  }

  input EditPlayScoreInput {
    rating: Float
    review: String
    isRecommended: [Recommendation]
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    userType: [UserType]
    isVerified: Boolean
  }

  input GameInput {
    name: String!
    developer: String
    publisher: String
    releaseDate: Int
    summary: String
    genre: [String]
  }

  type Mutation {
    createPlayScore(playScore: PlayScoreInput!): PlayScore
    updatePlayScore(id: ID!, playScore: EditPlayScoreInput): PlayScore
    deletePlayScore(id: ID!): PlayScore

    createUser(user: UserInput!): User
    updateUser(id: ID!, user: UserInput): User
    deleteUser(id: ID!): User

    createGame(game: GameInput!): Game
    updateGame(id: ID!, game: GameInput): Game
    deleteGame(id: ID!): Game
  }
`;
