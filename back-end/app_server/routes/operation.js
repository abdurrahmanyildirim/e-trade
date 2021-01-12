const express = require('express');
const router = express.Router();
const controller = require('../controllers/operation');

router.use('/update-cart', controller.updateCart);
router.use('/cart', controller.getCart);
router.use('/purchase-order', controller.purchaseOrder);

module.exports = router;
