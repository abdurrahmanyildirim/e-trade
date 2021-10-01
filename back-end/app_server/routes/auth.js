const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
// const verify = require('../services/verify');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/google', controller.googleAuth);
router.get('/change-password-request', controller.changePasswordRequest);
router.post('/change-password', controller.changePassword);
router.get('/activate-email', controller.activateEmail);
// router.use(verify.isAuth);

module.exports = router;
