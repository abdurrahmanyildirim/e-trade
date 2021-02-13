const express = require('express');
const router = express.Router();
const controller = require('../controllers/product');
const authController = require('../controllers/authController');

router.get('/products', controller.getProducts);
router.get('/get-by-category', controller.getByCategory);
router.get('/get-by-id', controller.getProductById);
router.use(authController.verifyAdmin);


module.exports = router;
