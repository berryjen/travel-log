const express = require('express');
const tokensController = require('../controllers/tokens');

const router = express.Router();

router.get('/', tokensController.list);
router.get('/:user_name', tokensController.get);
module.exports = router;
