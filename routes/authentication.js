const express = require('express');
const authenticationController = require('../controllers/authentication');

const router = express.Router();

router.post('/register', authenticationController.register);
router.post('/login', authenticationController.login);

module.exports = router;
