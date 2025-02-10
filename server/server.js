require("dotenv").config();

// const gameRoutes = require("./routes/game.routes");
// const userRoutes = require("./routes/user.routes");
// const playscoreRoutes = require("./routes/playscore.routes");
// const authRoutes = require("./routes/auth.routes");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");


const server = new ApolloServer({ typeDefs, resolvers });

// const express = require("express");
const { default: mongoose } = require("mongoose");

// const app = express();
// app.use(express.json());

// const cors = require("cors");
// app.use(cors());

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const port = process.env.PORT;

db.on("error", (error) => console.log(error));
db.on("open", async () => {
  const { url } = await startStandaloneServer(server, { 
    listen: port,
  });
  console.log(`Connected to Db, server ready at: ${url}`);
});

// app.use(gameRoutes);
// app.use(userRoutes);
// app.use(playscoreRoutes);
// app.use(authRoutes);
