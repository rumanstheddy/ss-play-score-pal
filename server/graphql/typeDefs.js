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
    CRITIC
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
    igdbID: String!
    userRating: Float
    criticRating: Float
  }

  type DeleteAcknowledgement {
    acknowledged: Boolean
    deletedCount: Int
  }

  type UpdateAcknowledgement {
    acknowledged: Boolean,
    modifiedCount: Int,
  }

  type Query {
    playScore(id: ID!): PlayScore
    playScoresByGameId(gameId: String!): [PlayScore]
    playScoresByUserId(userId: String!): [PlayScore]

    users: [User]
    user(id: ID!): User
    searchUsers(searchQuery: String!): [User]
    
    game(igdbID: String!): Game

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
    userType: UserType
  }

  input GameInput {
    igdbID: String!
    userScore: Float
    criticScore: Float
  }

  type Mutation {
    createPlayScore(playScore: PlayScoreInput!): PlayScore
    updatePlayScore(id: ID!, playScore: EditPlayScoreInput): UpdateAcknowledgement
    deletePlayScore(id: ID!): DeleteAcknowledgement
    
    signup(user: UserInput!): User
    updateUser(id: ID!, user: UserInput): User
    deleteUser(id: ID!): DeleteAcknowledgement

    createGame(game: GameInput!): Game
    updateGame(igdbID: String!, game: GameInput): UpdateAcknowledgement
    }
    `;
// calculateRatings: String
