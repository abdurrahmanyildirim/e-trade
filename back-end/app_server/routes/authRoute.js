const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/check-nick-name', authController.checkNickName);

module.exports = router;