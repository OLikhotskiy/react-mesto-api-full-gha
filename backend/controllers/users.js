const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED_CODE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;
// GET ALL USERS
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};
// GET USER INFO
const findUserById = (req, res, requiredData, next) => {
  User.findById(requiredData)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};
// FIND USER BY ID
module.exports.getUserId = (req, res, next) => {
  const requiredData = req.params.userId;
  findUserById(req, res, requiredData, next);
};
// FIND AUCH USER
module.exports.getUserInfo = (req, res, next) => {
  const requiredData = req.user._id;
  findUserById(req, res, requiredData, next);
};
// CREATE NEW USER
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res.status(CREATED_CODE).send(data);
    })
    .catch(next);
};
// UPDATE USER
const updateUser = (req, res, updateData, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};
// UPDATE USER INFO
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about }, next);
};
// UPDARE AVATAR
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar }, next);
};
// LOGIN
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET_KEY : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Возвращайтесь! Мы будем скучать (T⌓T)' });
};
