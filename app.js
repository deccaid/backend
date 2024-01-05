const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorsSender = require('./error/errorSender');
const httpStatusCodes = require('./error/errors');
const { createUser, login } = require('./controllers/users');

const { router } = require('./routes');

const app = express();
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(`${MONGO_URL}`)
  .then(() => console.log('база данных подключена'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(router);
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, router.users);
app.use('/cards', router.cards);
app.use('*', (req, res) => {
  res.status(httpStatusCodes.NOT_FOUND).send({ message: 'Not found Route' });
});

app.use(errors());
app.use(errorsSender);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
