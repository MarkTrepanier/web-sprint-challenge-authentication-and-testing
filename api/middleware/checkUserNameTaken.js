const User = require("../auth/auth-model");

module.exports = async (req, res, next) => {
  const { username } = req.body;
  const [oldUser] = await User.findBy({ username });
  if (oldUser) {
    next({ status: 400, message: "username taken" });
  }
  next();
};
