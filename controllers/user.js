exports.getUserController = (req, res, next) => {
  res
    .status(200)
    .json({
      message: "Get all Users",
    })
    .then((e) => {
      res.status(500).json({
        message: "Error found",
        error: e.message,
      });
    });
};
