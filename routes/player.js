const express = require("express");
const router = express.Router();
const {
  getAllPlayerController,
  getPlayerByIdcontroller,
  postPlayerController,
} = require("../controllers/player");

router.get("/", getAllPlayerController);
router.get("/:id", getPlayerByIdcontroller);
router.post("/", postPlayerController);

module.exports = router;
