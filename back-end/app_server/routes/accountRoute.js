const express = require('express')
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/upload', accountController.imageUpload);
router.get('/photo', accountController.getPhoto);
router.post('/change-password', accountController.changePassword);

module.exports = router;