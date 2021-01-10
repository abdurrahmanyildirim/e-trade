const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountController');

router.post('/upload', controller.imageUpload);
router.get('/photo', controller.getPhoto);
router.post('/change-password', controller.changePassword);

module.exports = router;
