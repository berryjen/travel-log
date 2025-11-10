const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/users');

const router = express.Router();

// function registerRoute(router, url, type, ...routeHandlers) {
//     if (typeof type === 'function') {
//         routeHandlers.unshift(type);
//         type = 'get';
//     } else if (typeof type === 'undefined') {
//         type = 'get';
//     }

//     const method = type.toLowerCase();
//     let handlers = routeHandlers;

//     if (method !== 'post') {
//         handlers = [authenticateMiddleware, ...routeHandlers];
//     }

//     if (router[method] && typeof router[method] === 'function') {
//         router[method](url, ...handlers);
//     } else {
//         console.error(`Invalid HTTP method provided: ${type} for route: ${url}`);
//     }
// };

// registerRoute(router, '/', usersController.list);
// registerRoute(router, '/:id', usersController.get);
// registerRoute(router, '/', 'post', usersController.create);

const ensureAuth = (req, res, next) => (req.isAuthenticated()
  ? next()
  : res.status(401).json({ status: 401, message: 'Unauthorized' }));

router.get('/', ensureAuth, usersController.list);
router.get('/:id', ensureAuth, usersController.get);
router.post('/', ensureAuth, usersController.create);

// /login <- gives you the session cookie with local strategy (manual)
// ensureAuth means you have the cookie from the agent (automatic)
// but just checking the user is authenticated
router.post('/login', passport.authenticate('local'), usersController.login);
// passport.authenticate('local', { session: false, failWithError: true })
module.exports = router;
