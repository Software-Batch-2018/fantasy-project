const mongoose = require("mongoose");

exports.connectDB = async () => {
  const MongoURI =
    "mongodb+srv://pubois:pubois123@fantasy.xneou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  try {
    await mongoose
      .connect(MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("Database connected...");
      })
      .catch((err) => {
        console.log("Connection failed...");
      });
  } catch (e) {
    console.log(`Database connection error : ${e}`);
  }
};
