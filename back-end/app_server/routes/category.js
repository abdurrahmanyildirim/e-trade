const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');
const authController = require('../controllers/auth');

router.get('/categories', controller.getCategories);
router.use(authController.verifyAdmin);
router.get('/add-category', controller.addCategory);

module.exports = router;
