const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/NotFoundError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => BadRequestError(`Карточки не найдены: ${err.message}`));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .catch((err) => {
      throw new BadRequestError(`Указаны некорректные данные при создании карточки: ${err.message}`);
    })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId);

  Card.deleteOne({ _id: req.params.cardId })
    .orFail(new Error('NotValidId'))
    .catch(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }
      Card.findByIdAndDelete(req.params._id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('IncorrectCardID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else if (err.message === 'IncorrectCardID') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('IncorrectCardID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else if (err.message === 'IncorrectCardID') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};
