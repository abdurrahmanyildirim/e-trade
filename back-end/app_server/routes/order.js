const express = require('express');
const router = express.Router();
const controller = require('../controllers/order');

router.get('/get-orders', controller.getOrders);
router.get('/detail/:id', controller.orderDetail);

module.exports = router;
