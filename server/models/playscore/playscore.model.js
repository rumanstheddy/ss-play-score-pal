const mongoose = require("mongoose");

const playScoreSchema = require("./playscore.schema");

module.exports = mongoose.model("PlayScoreModel", playScoreSchema);
