const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getCurrentUser, patchUser, patchAvatarUser, createUser, getUserMe,
} = require('../controllers/users');
const regExp = require('../regexp/regexp');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExp),
  }),
}), patchAvatarUser);
router.post('/', createUser);

module.exports = router;
