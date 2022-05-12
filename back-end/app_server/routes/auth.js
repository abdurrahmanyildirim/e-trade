const router = require('express').Router();
const {
  activateEmail,
  changePassword,
  changePasswordRequest,
  googleAuth,
  login,
  register,
  sendActivationMail
} = require('../controllers/auth');
const { isAuth } = require('../services/verify');

/**
 *  /api/auth/login
 */
router.post('/login', login);

/**
 *  /api/auth/register
 */
router.post('/register', register);

/**
 *  /api/auth/google
 */
router.post('/google', googleAuth);

/**
 *  /api/auth/change-password-request
 */
router.get('/change-password-request', changePasswordRequest);

/**
 *  /api/auth/change-password
 */
router.post('/change-password', changePassword);

/**
 *  /api/auth/activate-email
 */
router.get('/activate-email', activateEmail);

/**
 *  /api/auth/send-activation-mail
 */
router.get('/send-activation-mail', isAuth, sendActivationMail);

module.exports = router;
