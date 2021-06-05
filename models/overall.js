const mongoose = require("mongoose");

const reqNum = {
  type: Number,
  required: true,
  default: 0,
};

const overallStatsSchema = mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" }, //foreign
  totalGoals: reqNum,
  totalassists: reqNum,
  cleansheets: reqNum,
  points: reqNum,
});

module.exports = mongoose.model("Overall", overallStatsSchema);
