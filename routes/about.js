const express = require('express');
const passport = require('passport');
const aboutController = require('../controllers/about');

const router = express.Router();
router.get('/', passport.authenticate('bearer', { session: false }), aboutController.list);

module.exports = router;
