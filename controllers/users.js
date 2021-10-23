const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(404).send({ message: `Пользователи не найдены: ${err.message}` }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.patchUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user.userId,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Пользователь не обновлен. Введены некоректные данные: ${err.message}` }));
};

module.exports.patchAvatarUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user.userId,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Аватар не обновлен. Введены некоректные данные: ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Пользователь не создан. Введены некоректные данные: ${err.message}` }));
};
