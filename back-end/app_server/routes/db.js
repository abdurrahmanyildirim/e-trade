const express = require('express');
const router = express.Router();
const { createBackUp } = require('../controllers/db');
const { isAdmin } = require('../services/verify');

/**
 *  /api/db/create-backup
 */
router.get('/create-backup', isAdmin, createBackUp);

module.exports = router;
