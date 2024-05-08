const express = require('express');
const passport = require('passport');
const visitsController = require('../controllers/visits');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('bearer', { session: false }),
  visitsController.list,
);
router.get(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  visitsController.get,
);
// this post route is for new visits
router.post(
  '/',
  passport.authenticate('bearer', { session: false }),
  visitsController.create,
);
router.delete(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  visitsController.delete,
);
router.get(
  '/new',
  passport.authenticate('bearer', { session: false }),
  visitsController.list,
);

module.exports = router;
