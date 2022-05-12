const express = require('express');
const router = express.Router();
const { getCategories, insert, remove } = require('../controllers/category');
const { isAdmin } = require('../services/verify');

/**
 *  /api/category/
 */
router.get('/', getCategories);

/**
 *  /api/category/insert
 */
router.get('/insert', isAdmin, insert);

/**
 *  /api/category/remove
 */
router.get('/remove', isAdmin, remove);

module.exports = router;
