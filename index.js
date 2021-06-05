const express = require("express");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const playerRoute = require("./routes/player");
const teamRoute = require("./routes/team");
const { connectDB } = require("./config/db");

dotenv.config();
const PORT = 4000;

// MongoDB connection here.
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes here
app.use("/api/user", userRoute);
app.use("/api/player", playerRoute);
app.use("/api/team", teamRoute);
app.use("/", (req, res, next) => {
  res.status(200).json({ Message: "This is home route" });
});

//Listen to server
app.listen(PORT, () => {
  console.log(`Listening in Port ${PORT}`);
});
