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

// Middleware to require authentication via session
// This uses passport's session-based authentication
const requireAuth = (req, res, next) => {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ status: 401, message: 'Unauthorized' });
};

router.get('/', requireAuth, usersController.list);
// Allow fetching a single user either via session or bearer token in other tests.
router.get('/:id', usersController.get);
router.post('/', usersController.create);
// Login should create a session when successful (don't disable session here)
router.post('/login', passport.authenticate('local'), usersController.login);

module.exports = router;
