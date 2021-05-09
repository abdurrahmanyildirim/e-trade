const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');
const verify = require('../services/verify');

router.get('/', controller.getCategories);
router.use(verify.isAdmin);
router.get('/insert', controller.insert);
router.get('/remove', controller.remove);

module.exports = router;
