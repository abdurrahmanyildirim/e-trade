const express = require('express');
const router = express.Router();
const controller = require('../controllers/product');
const authController = require('../controllers/auth');

router.get('/products', controller.getProducts);
router.get('/get-by-category', controller.getByCategory);
router.get('/get-by-id', controller.getProductById);
router.use(authController.verifyToken);
router.get('/rating', controller.addComment);
router.post('/stock-control', controller.checkStock);
router.use(authController.verifyAdmin);
router.post('/new-product', controller.addNewProduct);
router.delete('/remove', controller.remove);
router.post('/update', controller.update);
router.get('/all-products', controller.getAllProducts);

module.exports = router;
