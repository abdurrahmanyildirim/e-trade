const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact');

router.post('/contact-request', controller.sendContactRequest);

module.exports = router;
