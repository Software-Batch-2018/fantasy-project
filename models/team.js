const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
  // auto
  teamName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Team", TeamSchema);
