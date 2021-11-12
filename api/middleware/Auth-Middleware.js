const User = require("../auth/auth-model");
const bcrypt = require("bcryptjs");

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

async function ValidateUser(req, res, next) {
  const { username } = req.body;
  const [user] = await User.findBy({ username });
  if (!user) {
    next({ status: 404, message: "invalid credentials" });
  }
  req.user = user;
  next();
}

async function ValidatePassword(req, res, next) {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    next();
  }
  next({ status: 400, message: "invalid credentials" });
}

module.exports = {
  CheckUsernameTaken,
  ValidateBody,
  ValidateUser,
  ValidatePassword,
};
