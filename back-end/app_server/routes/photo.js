const express = require('express');
const router = express.Router();
const controller = require('../controllers/photo');
const verify = require('../services/verify');
const fileUpload = require('express-fileupload');

router.use(verify.isAdmin);
router.use(fileUpload({ useTempFiles: true }));
router.post('/upload', controller.photoUpload);

module.exports = router;
