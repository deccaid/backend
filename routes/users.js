const { Router } = require('express');
const {
  getUsers,
  createUser,
  getUserByID,
  updateUserInfo,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:idUser', getUserByID);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.get('/me', getMe);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = { userRouter };
