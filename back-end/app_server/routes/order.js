const express = require('express');
const router = express.Router();
const controller = require('../controllers/order');
const verify = require('../services/verify');

router.use(verify.isAuth);
router.get('/', controller.getOrders);
router.get('/detail', controller.orderDetail);
router.use(verify.isAdmin);
router.get('/all', controller.allOrders);
router.get('/statuses', controller.getStatuses);
router.post('/update-status', controller.updateStatus);

module.exports = router;
