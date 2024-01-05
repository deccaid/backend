const jwt = require('jsonwebtoken');

const UnplannedError = require('../errors/unplannedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnplannedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnplannedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
