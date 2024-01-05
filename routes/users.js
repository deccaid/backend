const { Router } = require('express');
const {
  getUsers,
  createUser,
  getUserByID,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:idUser', getUserByID);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.get('/me', getCurrentUser);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = { userRouter };
