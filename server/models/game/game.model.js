const mongoose = require("mongoose");

const gameSchema = require("./game.schema");

module.exports = mongoose.model("GameModel", gameSchema);
