const express = require('express');
const router = express.Router();
const {
  addComment,
  addNewProduct,
  checkStock,
  getAllProducts,
  getByCategory,
  getProductById,
  getProducts,
  remove,
  update
} = require('../controllers/product');
const { isAdmin, isAuth } = require('../services/verify');

/**
 * /api/product/
 */
router.get('/', getProducts);

/**
 * /api/product/get-by-category
 */
router.get('/get-by-category', getByCategory);

/**
 * /api/product/get-by-id
 */
router.get('/get-by-id', getProductById);

/**
 * /api/product/rating
 */
router.get('/rating', isAuth, addComment);

/**
 * /api/product/stock-control
 */
router.post('/stock-control', isAuth, checkStock);

/**
 * /api/product/insert
 */
router.post('/insert', isAdmin, addNewProduct);

/**
 * /api/product/remove
 */
router.delete('/remove', isAdmin, remove);

/**
 * /api/product/update
 */
router.post('/update', isAdmin, update);

/**
 * /api/product/all
 */
router.get('/all', isAdmin, getAllProducts);

module.exports = router;
