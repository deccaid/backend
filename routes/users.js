const { Router } = require('express');
const { celebrate } = require('celebrate');
const {
  getUsers,
  createUser,
  getUserByID,
  updateUserInfo,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');

const { updateUserScheme, updateAvatarScheme } = require('../joiSchemes');

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:idUser', getUserByID);
userRouter.post('/', createUser);
userRouter.get('/me', getMe);
userRouter.patch('/me', celebrate(updateUserScheme), updateUserInfo);
userRouter.patch('/me/avatar', celebrate(updateAvatarScheme), updateUserAvatar);

module.exports = { userRouter };
