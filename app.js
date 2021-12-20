require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { errors, celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const regExp = require('./regexp/regexp');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с вашего IP, попробуйте повторить попытку позже',
});

app.use(requestLogger);

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regExp),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
  }),
}), createUser);

app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый Ресурс не найден.')));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen( () => {
  console.log(`App listening on port`);
});