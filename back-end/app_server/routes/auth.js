const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.use(controller.verifyToken);
router.get('/contact-info', controller.contactInfo);
router.get('/user/:id', controller.getUser);
router.use(controller.verifyAdmin);


module.exports = router;
