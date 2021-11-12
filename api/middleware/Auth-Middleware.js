const User = require("../auth/auth-model");

async function CheckUsernameTaken(req, res, next) {
  const { username } = req.body;
  const [oldUser] = await User.findBy({ username });
  if (oldUser) {
    next({ status: 400, message: "username taken" });
  }
  next();
}

function ValidateBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ status: 400, message: "username and password required" });
  }
  next();
}

module.exports = {
  CheckUsernameTaken,
  ValidateBody,
};
