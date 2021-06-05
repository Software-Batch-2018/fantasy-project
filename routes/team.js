const express = require("express");
const router = express.Router();
const {
  getAllTeamController,
  getTeamByIdcontroller,
  postTeamController,
} = require("../controllers/team");

router.get("/", getAllTeamController);
router.get("/:id", getTeamByIdcontroller);
router.post("/", postTeamController);

module.exports = router;
