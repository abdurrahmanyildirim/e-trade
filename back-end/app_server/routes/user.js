const express = require('express');
const router = express.Router();
const { getUser, update, updatePassword, getUserById } = require('../controllers/user');
const { isAuth, isAdmin } = require('../services/verify');

/**
 * /api/user/
 */
router.get('/', isAuth, getUser);

/**
 * /api/user/update
 */
router.post('/update', isAuth, update);

/**
 * /api/user/update-password
 */
router.post('/update-password', isAuth, updatePassword);

/**
 * /api/user/getbyid
 */
router.get('/getbyid', isAdmin, getUserById);

module.exports = router;
