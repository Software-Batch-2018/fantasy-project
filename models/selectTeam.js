const mongoose = require("mongoose");

const selectedTeamSchema = mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});

module.exports = mongoose.model("SelectedTeam", selectedTeamSchema);
