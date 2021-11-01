const router = require('express').Router();

const {
  getUsers, getCurrentUser, patchUser, patchAvatarUser, createUser, getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getCurrentUser);
router.get('/me', getUserMe);
router.patch('/me', patchUser);
router.patch('/me/avatar ', patchAvatarUser);
router.post('/', createUser);

module.exports = router;
