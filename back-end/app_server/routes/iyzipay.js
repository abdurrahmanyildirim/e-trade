const express = require('express');
const router = express.Router();
const controller = require('../controllers/iyzipay');

// router.use(isAuth);
router.post('/callback', controller.iyzipayCallBack);

module.exports = router;
