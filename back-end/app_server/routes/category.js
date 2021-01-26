const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');

router.get('/categories', controller.getCategories);

module.exports = router;
