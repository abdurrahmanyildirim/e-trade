const express = require('express');
const router = express.Router();
const controller = require('../controllers/operation');

router.post('/update-cart', controller.updateCart);
router.get('/cart', controller.getCart);
router.post('/purchase-order', controller.purchaseOrder);

module.exports = router;
