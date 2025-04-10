const express = require('express');
const countriesController = require('../controllers/countries');

const router = express.Router();

router.get('/', countriesController.list);
router.get('/search', countriesController.search);
router.get('/:id', countriesController.get);
router.post('/', countriesController.create);
router.delete('/:id', countriesController.delete);
module.exports = router;
