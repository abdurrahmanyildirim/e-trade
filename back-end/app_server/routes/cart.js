const express = require('express');
const router = express.Router();
const { getCart, purchaseOrder, updateCart } = require('../controllers/cart');
const { isAuth } = require('../services/verify');

/**
 *  /api/cart/
 */
router.get('/', isAuth, getCart);

/**
 *  /api/cart/update
 */
router.post('/update', isAuth, updateCart);

/**
 *  /api/cart/purchase-order
 */
router.post('/purchase-order', isAuth, purchaseOrder);

module.exports = router;
