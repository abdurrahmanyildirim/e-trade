const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart');
const verify = require('../services/verify');

router.use(verify.isAuth);
router.get('/', controller.getCart);
router.post('/update', controller.updateCart);
router.post('/purchase-order', controller.purchaseOrder);

module.exports = router;
