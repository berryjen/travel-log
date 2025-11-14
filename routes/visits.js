const express = require('express');
const visitsController = require('../controllers/visits');

const router = express.Router();

const ensureAuth = (req, res, next) => (req.isAuthenticated()
  ? next()
  : res.status(401).json({ status: 401, message: 'Unauthorized' }));

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
  visitsController.create,
);
router.delete(
  '/:id',
  ensureAuth,
  visitsController.delete,
);

module.exports = router;
