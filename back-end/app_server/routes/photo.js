const express = require('express');
const router = express.Router();
const { upload } = require('../controllers/photo');
const { isAdmin } = require('../services/verify');
const fileUpload = require('express-fileupload');

/**
 * /api/photo/upload
 */
router.post('/upload', isAdmin, fileUpload({ useTempFiles: true }), upload);

module.exports = router;
