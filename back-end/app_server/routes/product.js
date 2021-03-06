const express = require('express');
const router = express.Router();
const controller = require('../controllers/product');
const verify = require('../services/verify');

router.get('/', controller.getProducts);
router.get('/get-by-category', controller.getByCategory);
router.get('/get-by-id', controller.getProductById);
router.use(verify.isAuth);
router.get('/rating', controller.addComment);
router.post('/stock-control', controller.checkStock);
router.use(verify.isAdmin);
router.post('/insert', controller.addNewProduct);
router.delete('/remove', controller.remove);
router.post('/update', controller.update);
router.get('/all', controller.getAllProducts);

module.exports = router;
