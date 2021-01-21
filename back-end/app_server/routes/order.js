const express = require('express');
const router = express.Router();
const controller = require('../controllers/order');

router.get('/get-order', controller.getOrders);

module.exports = router;
