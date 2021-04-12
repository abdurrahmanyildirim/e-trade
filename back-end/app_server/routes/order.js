const express = require('express');
const router = express.Router();
const controller = require('../controllers/order');
const verify = require('../services/verify');

router.use(verify.isClient);
router.get('/get-orders', controller.getOrders);
router.get('/detail/:id', controller.orderDetail);
router.use(verify.isAdmin);
router.get('/all-orders', controller.allOrders);
router.get('/statuses', controller.getStatuses);
router.post('/update-status/:id', controller.updateStatus);

module.exports = router;
