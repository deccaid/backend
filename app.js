const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { router } = require('./routes');

const app = express();
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(`${MONGO_URL}`)
  .then(() => console.log('база данных подключена'))
  .catch((err) => console.error(err));
app.use(requestLogger);
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '657ae2eea0c268245901e59b',
  };
  next();
});
app.use(helmet());
app.use(router);
app.use(errorLogger);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
