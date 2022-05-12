const express = require('express');
const router = express.Router();
const {
  allOrders,
  getOrders,
  getStatuses,
  orderDetail,
  updateStatus
} = require('../controllers/order');
const { isAdmin, isAuth } = require('../services/verify');

/**
 *  /api/order/
 */
router.get('/', isAuth, getOrders);

/**
 *  /api/order/detail
 */
router.get('/detail', isAuth, orderDetail);

/**
 *  /api/order/all
 */
router.get('/all', isAdmin, allOrders);

/**
 *  /api/order/statuses
 */
router.get('/statuses', isAdmin, getStatuses);

/**
 *  /api/order/update-status
 */
router.post('/update-status', isAdmin, updateStatus);

module.exports = router;
