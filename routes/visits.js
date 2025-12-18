const express = require('express');
const visitsController = require('../controllers/visits');

const router = express.Router();

// const ensureAuth = (req, res, next) => (req.isAuthenticated()
//   ? next()
//   : res.status(401).json({ status: 401, message: 'Unauthorized' }));

const ensureAuth = (req, res, next) => {
  console.log('=== ensureAuth Middleware ===');
  console.log('req.isAuthenticated():', req.isAuthenticated());
  console.log('req.session:', req.session);
  console.log('req.user:', req.user);
  console.log('req.cookies:', req.cookies);
  console.log('Raw cookie header:', req.headers.cookie);
  console.log('============================');

  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ status: 401, message: 'Unauthorized' });
  }
};

router.get(
  '/',
  ensureAuth,
  visitsController.list,
);
router.get(
  '/:id',
  ensureAuth,
  visitsController.get,
);
// this post route is for new visits
router.post(
  '/',
  ensureAuth,
  visitsController.create,
);
router.delete(
  '/:id',
  ensureAuth,
  visitsController.delete,
);

module.exports = router;
