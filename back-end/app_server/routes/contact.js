const express = require('express');
const router = express.Router();
const controller = require('../controllers/contact');
const verify = require('../services/verify');

router.post('/request', controller.sendContactRequest);
router.use(verify.isAdmin);
router.get('/messages', controller.getMessages);
router.get('/toggle-read', controller.toggleRead);
router.get('/remove', controller.remove);

module.exports = router;
