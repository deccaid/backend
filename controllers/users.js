const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const BadRequest = require('../error/badRequest');
const NotFound = require('../error/notFound');
const Conflict = require('../error/conflict');
const httpStatusCodes = require('../error/errors');

const STATUS_OK = 200;

// получить всех пользователя
const getUsers = (req, res, next) => {
  userModel.find()
    .then((users) => res
      .status(STATUS_OK)
      .send(users))
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
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      res
        .status(STATUS_OK)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(httpStatusCodes.status)
          .send({ message: httpStatusCodes.message });
      } if (error.message === 'notValidId') {
        res
          .status(httpStatusCodes.status)
          .send({ message: httpStatusCodes.message });
      }
      return res
        .status(httpStatusCodes.status)
        .send({ message: httpStatusCodes.message });
    });
};

// обновить аватар пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(httpStatusCodes.status)
          .send({ message: httpStatusCodes.message });
      } if (error.message === 'notValidId') {
        res
          .status(httpStatusCodes.status)
          .send({ message: httpStatusCodes.message });
      }
      return res
        .status(httpStatusCodes.status)
        .send({ message: httpStatusCodes.message });
    });
};

function login(req, res, next) {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'yandex-praktikum', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
}
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
