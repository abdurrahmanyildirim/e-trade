const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const verify = require('../services/verify');

router.use(verify.isAuth);
router.post('/update-contact', controller.updateContactInfo);
router.post('/update-general', controller.updateGeneralInfo);
router.post('/update-password', controller.updatePassword);

module.exports = router;
