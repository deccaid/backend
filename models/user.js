const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Username should be from 2 up to 30 symbols!',
      },
    },
    about: {
      type: String,
      required: [true, 'Поле "about" должно быть заполнено'],
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'User info should be from 2 up to 30 symbols!',
      },
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      required: [true, 'Поле "avatar" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Введите корректный URL',
      },
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('user', userSchema);
