const express = require('express');
const router = express.Router();
const controller = require('../controllers/db');
const verify = require('../services/verify');

router.get('/create-backup', controller.createBackUp);
// router.use(verify.isAdmin);

module.exports = router;
