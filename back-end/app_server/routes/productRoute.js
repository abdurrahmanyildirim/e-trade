const express = require('express');
const router = express.Router();
const controller = require('../controllers/product');

// router.post('/update-cart', controller.updateCart);
router.get('/products', controller.getProducts);

module.exports = router;
