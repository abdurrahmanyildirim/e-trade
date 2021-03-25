const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const authController = require('../controllers/auth');

// router.use(authController.verifyAdmin);
router.post('/update-contact', controller.updateContactInfo);
router.post('/update-general', controller.updateGeneralInfo);
router.post('/update-password', controller.updatePassword);
// router.get('/get-photo', controller.getPhoto);

module.exports = router;
