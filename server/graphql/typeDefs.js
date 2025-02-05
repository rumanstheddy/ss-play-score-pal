const { gql } = require("apollo-server");

module.exports = gql`
  enum Recommendation {
    YES
    ONSALE
    NO
  }

  type PlayScore {
    gameId: String
    userId: String
    rating: Float
    review: String!
    isRecommended: [Recommendation]
    createdAt: Int
    updatedAt: Int
  }

  enum UserType {
    USER
    ADMIN
  }

  type User {
    firstName: String
    lastName: String
    email: String
    password: String
    userType: [UserType]
    isVerified: Boolean
    createdAt: Int
  }

  type Game {
    name: String
    developer: String
    publisher: String
    releaseDate: Int
    summary: String!
    genre: [String]
  }
`;
