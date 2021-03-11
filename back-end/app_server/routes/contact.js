const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact');
const authController = require('../controllers/authController');

router.post('/contact-request', controller.sendContactRequest);
router.use(authController.verifyAdmin);
router.get('/messages', controller.getMessages);
router.get('/toggle-read', controller.toggleRead);
router.get('/remove', controller.remove);

module.exports = router;
