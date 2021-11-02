const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const regExp = require('./regexp/regexp');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
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

app.use(errors());

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).json({ err: message || 'На сервере произошла ошибка' });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
