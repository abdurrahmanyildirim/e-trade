const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/check-nick-name', controller.checkNickName);

module.exports = router;
