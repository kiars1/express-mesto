const User = require('../models/user');

module.exports.getUsers = (req, res) => {
    User.find({})
        .then(users => res.send({ data: users }))
        .catch(err => res.status(404).send({ message: `Пользователи не найдены: ${err.message}` }));
};

module.exports.getCurrentUser = (req, res) => {
    User.findById(req.params._id)
        .then(user => res.send({ data: user }))
        .catch(err => res.status(404).send({ message: `Пользовател не найден: ${err.message}`}));
};

module.exports.patchUser = (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        { name: req.body.name, about: req.body.about }
    )
        .then(user => res.send({ data: user }))
        .catch(err => res.status(400).send({ message: `Пользователь не обновлен. Введены некоректные данные: ${err.message}` }));
};

module.exports.patchAvatarUser = (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        { avatar: req.body.avatar }
    )
        .then(user => res.send({ data: user }))
        .catch(err => res.status(400).send({ message: `Аватар не обновлен. Введены некоректные данные: ${err.message}` }));
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;

    User.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch(err => res.status(400).send({ message: `Пользователь не создан. Введены некоректные данные: ${err.message}` }));
};