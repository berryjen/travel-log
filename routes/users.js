const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/users');

const router = express.Router();

const ensureAuth = (req, res, next) => (req.isAuthenticated()
  ? next()
  : res.status(401).json({ status: 401, message: 'Unauthorized' }));
// the .get routes act more like the authorization step where the user has already been authenticated
// by local strategy and already haw a session cookie
// this step is to grant authoriation the user to access the resource
router.get('/', ensureAuth, usersController.list);
router.get('/:id', ensureAuth, usersController.get);

router.post('/', usersController.create);
router.post('/login', passport.authenticate('local'), usersController.login);

// passport.authenticate('local', { session: false, failWithError: true })
module.exports = router;
