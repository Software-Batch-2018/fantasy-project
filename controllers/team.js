exports.getAllTeamController = (req, res, next) => {
  res.status(200).json({
    messsage: "Get all Teams",
  });
};

exports.getTeamByIdcontroller = (req, res, next) => {
  res.status(200).json({
    messsage: "Get selected Team",
  });
};

exports.postTeamController = (req, res, next) => {
  res.status(200).json({
    messsage: "Post Team",
  });
};
