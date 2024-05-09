require("dotenv").config();

const gameRoutes = require("./routes/game.routes");
const userRoutes = require("./routes/user.routes");
const playscoreRoutes = require("./routes/playscore.routes");
const authRoutes = require("./routes/auth.routes");

const express = require("express");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const port = process.env.PORT;

db.on("error", (error) => console.log(error));
db.on("open", () => app.listen(port));
db.on("open", () =>
  console.log(`Connected to Db, server started at port: ${port}`)
);

app.use(gameRoutes);
app.use(userRoutes);
app.use(playscoreRoutes);
app.use(authRoutes);
