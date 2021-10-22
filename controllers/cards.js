const Card = require('../models/card');

module.exports.getCards = (req, res) => {
    Card.find({})
        .then((cards) => res.send({ data: cards }))
        .catch((err) => res.status(404).send({ message: `Карточки не найдены: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    Card.create({ name, link, owner: req.user._id })

        .then((card) => res.send({data: card}))
        .catch((err) => res.status(400).send({ message: `Карточка не создана. Введены некоректные данные: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
    Card.findById(req.params._id)

    Card.delete(req.params._id)
        .then((cardData) => {
            res.send({ data: cardData });
        })
        .catch(err => res.status(400).send({ message: `Карточка не удалена. ${err.message}` }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
)