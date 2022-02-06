const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const verify = require('../services/verify');

router.use(verify.isAuth);
router.get('/', controller.getUser);
router.post('/update', controller.update);
router.post('/update-password', controller.updatePassword);
router.use(verify.isAdmin);
router.get('/getbyid', controller.getUserById);

module.exports = router;
