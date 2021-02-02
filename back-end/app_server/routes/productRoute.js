const express = require('express');
const router = express.Router();
const controller = require('../controllers/product');

router.get('/products', controller.getProducts);
router.get('/get-by-category', controller.getByCategory);
router.get('/get-by-id', controller.getProductById);

module.exports = router;
