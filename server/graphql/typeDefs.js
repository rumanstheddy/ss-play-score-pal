module.exports = `
  enum Recommendation {
    YES
    ONSALE
    NO
  }

  type PlayScore {
    _id: ID!
    gameId: String!
    userId: String!
    rating: Float!
    review: String
    isRecommended: Recommendation!
    createdAt: String
    updatedAt: String
  }

  enum UserType {
    USER
    ADMIN
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    userType: UserType
    isVerified: Boolean
    createdAt: String
  }

  type Game {
    _id: ID!
    name: String!
    developer: String
    publisher: String
    releaseDate: Int
    summary: String
    genre: [String]
  }

  type DeleteAcknowledgement {
    acknowledged: Boolean
    deletedCount: Int
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
    login(email: String!, password: String!): User
  }

  input PlayScoreInput {
    gameId: String!
    userId: String!
    rating: Float!
    review: String
    isRecommended: Recommendation!
  }

  input EditPlayScoreInput {
    rating: Float
    review: String
    isRecommended: Recommendation
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
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
    
    signup(user: UserInput!): User
    updateUser(id: ID!, user: UserInput): User
    deleteUser(id: ID!): DeleteAcknowledgement

    createGame(game: GameInput!): Game
    updateGame(id: ID!, game: GameInput): Game
    deleteGame(id: ID!): Game
  }
`;
