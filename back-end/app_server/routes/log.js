const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/log');
const { isAdmin } = require('../services/verify');

/**
 * /api/log/
 */
router.get('/', isAdmin, getLogs);

module.exports = router;
