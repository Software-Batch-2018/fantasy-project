exports.getAllPlayerController = (req, res, next) => {
  res.status(200).json({
    messsage: "Get all players",
  });
};

exports.getPlayerByIdcontroller = (req, res, next) => {
  res.status(200).json({
    messsage: "Get selected player",
  });
};

exports.postPlayerController = (req, res, next) => {
  res.status(200).json({
    messsage: "Post Player",
  });
};
