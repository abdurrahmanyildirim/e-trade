const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.use(controller.verifyToken);
router.get('/contact-info', controller.contactInfo);
router.use(controller.verifyAdmin);
router.get('/user/:id', controller.getUser);

module.exports = router;
