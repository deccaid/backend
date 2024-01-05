const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const BadRequest = require('../error/badRequest');
const NotFound = require('../error/notFound');
const Conflict = require('../error/conflict');
const httpStatusCodes = require('../error/errors');

const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUser(email, password).then((user) => {
    const token = jwt.sign({ id: user._id }, 'yandex', { expiresIn: '7d' });
    res.cookie('jwt', token, { maxAge: 1000 * 3600 * 24 * 7, httpOnly: true, domain: '.localhost' });
    res.status(200).send({ id: user._id });
  })
    .catch((err) => {
      if (err.name === 'Unauthorized') res.status(httpStatusCodes.UNAUTHORIZED).send({ message: err.message });
      next(err);
    });
};

// получить всех пользователя
const getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

// получить пользователя по определенному ID
const getUserByID = (req, res, next) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFound('User with current _id can\'t be found!');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Bad request!'));
      }
      next(err);
    });
};

// создать нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashPassword) => userModel.create({
      name, about, avatar, email, password: hashPassword,
    }))
    .then((user) => {
      const result = user.toObject();
      delete result.password;
      res.status(httpStatusCodes.CREATED).send(result);
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' || err.code === 11000) {
        next(new Conflict('User with this email already exists!'));
      }
      next(err);
    });
};

// обновить информацию о пользователе
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user.id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFound('User with current _id can\'t be found!');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Bad request!'));
      }
      next(err);
    });
};

// обновить аватар пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user.id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFound('User with current _id can\'t be found!');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(httpStatusCodes.BAD_REQUEST).send({ message: 'Bad request!' });
      }
      next(err);
    });
};

const getMe = (req, res, next) => {
  userModel.findById(req.user.id)
    .then((user) => {
      if (!user) {
        throw new NotFound('User with current _id can\'t be found!');
      }
      return res.status(httpStatusCodes.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Bad request!'));
      }
      next(err);
    });
};

module.exports = {
  getMe,
  login,
  getUsers,
  getUserByID,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
