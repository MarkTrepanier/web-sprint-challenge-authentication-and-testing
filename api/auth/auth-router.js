const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("./auth-model");
const tokenBuilder = require("./tokenBuilder");
const {
  CheckUsernameTaken,
  ValidateBody,
  ValidateUser,
  ValidatePassword,
} = require("../middleware/Auth-Middleware");

router.post("/register", ValidateBody, CheckUsernameTaken, (req, res, next) => {
  const newUser = req.body;

  const rounds = process.env.BCRYPT_ROUNDS || 6;
  const hashed = bcrypt.hashSync(newUser.password, rounds);
  newUser.password = hashed;
  User.addUser(newUser)
    .then((resp) => {
      res.status(201).json(resp);
    })
    .catch((err) => next(err));
});

router.post(
  "/login",
  ValidateBody,
  ValidateUser,
  ValidatePassword,
  //eslint-disable-next-line
  (req, res, next) => {
    const token = tokenBuilder(req.user);
    res.status(200).json({ message: `welcome ${req.user.username}`, token });
  }
);

module.exports = router;
