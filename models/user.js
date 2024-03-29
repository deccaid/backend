const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      required: [true, 'Поле "name" должно быть заполнено'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      required: [true, 'Поле "about" должно быть заполнено'],
    },
    avatar: {
      type: String,
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
