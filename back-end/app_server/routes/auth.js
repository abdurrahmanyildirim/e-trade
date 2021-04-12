const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const verify = require('../services/verify');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/google', controller.googleAuth);
router.use(verify.isClient);
router.get('/contact-info', controller.contactInfo);
router.get('/user/:id', controller.getUser);

module.exports = router;
