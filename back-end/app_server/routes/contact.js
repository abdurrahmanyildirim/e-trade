const express = require('express');
const router = express.Router();
const { getMessages, remove, sendContactRequest, toggleRead } = require('../controllers/contact');
const { isAdmin } = require('../services/verify');

/**
 *  /api/contact/request
 */
router.post('/request', sendContactRequest);

/**
 *  /api/contact/messages
 */
router.get('/messages', isAdmin, getMessages);

/**
 *  /api/contact/toggle-read
 */
router.get('/toggle-read', isAdmin, toggleRead);

/**
 *  /api/contact/remove
 */
router.get('/remove', isAdmin, remove);

module.exports = router;
