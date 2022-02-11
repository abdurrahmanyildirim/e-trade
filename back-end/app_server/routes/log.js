const express = require('express');
const router = express.Router();
const controller = require('../controllers/log');
const verify = require('../services/verify');

router.use(verify.isAdmin);
router.get('/', controller.getLogs);

module.exports = router;
