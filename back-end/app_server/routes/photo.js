const express = require('express');
const router = express.Router();
const controller = require('../controllers/photo');
const authController = require('../controllers/auth');

router.use(authController.verifyAdmin);
router.post('/upload', controller.photoUpload);
// router.get('/get-photo', controller.getPhoto);

module.exports = router;
