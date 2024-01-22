require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.on("open", () => console.log("Connected to Db"));

const port = process.env.PORT;

app.listen(port, () => console.log(`Server started, listening on ${port}`));
