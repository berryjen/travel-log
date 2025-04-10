const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/users');

const router = express.Router();

router.get('/', passport.authenticate('bearer', { session: false }), usersController.list);
router.get('/:id', passport.authenticate('bearer', { session: false }), usersController.get);

// router.get('/', usersController.list);
// router.get('/:id', usersController.get);
// router.post('/', usersController.create);

module.exports = router;
