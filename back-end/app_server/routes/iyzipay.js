const express = require('express');
const router = express.Router();
const { callBack } = require('../controllers/iyzipay');

/**
 *  /api/iyzipay/callback
 */
router.post('/callback', callBack);

module.exports = router;
