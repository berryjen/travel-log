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

router.get('/', passport.authenticate('bearer', { session: false }), usersController.list);
router.get('/:id', passport.authenticate('bearer', { session: false }), usersController.get);
router.post('/', usersController.create);

module.exports = router;
