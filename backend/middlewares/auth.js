const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const Notauthorized = require('../errors/Notauthorized');

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    return next(new Notauthorized('Авторизируйтесь!'));
  }
  const token = cookie.replace('jwt', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'secret-key');
  } catch (err) {
    return next(new Notauthorized('Авторизируйтесь!'));
  }
  req.user = payload;
  return next();
};
