const express = require('express');
const authenticationController = require('../controllers/authentication');

const router = express.Router();

router.post('/register', authenticationController.register);

module.exports = router;
