const auth = require('./auth');
const product = require('./product');
const account = require('./photo');
const cart = require('./cart');
const order = require('./order');
const category = require('./category');
const contact = require('./contact');
const user = require('./user');
const db = require('./db');
const iyzipay = require('./iyzipay');
const log = require('./log');
const { Router } = require('express');
const router = Router();
const loggerService = require('../services/log');
const { isDevMode } = require('../../common');

router.use('/auth', auth);
router.use('/product', product);
router.use('/category', category);
router.use('/contact', contact);
router.use('/cart', cart);
router.use('/user', user);
router.use('/order', order);
router.use('/photo', account);
router.use('/db', db);
router.use('/iyzipay', iyzipay);
router.use('/log', log);

router.use((err, req, res, next) => {
  if (err) {
    if (isDevMode()) {
      console.log(err);
    }
    loggerService.error(req, err);
  }
  return res.status(500).send({ message: 'Bir hata oluştu.' });
});

module.exports = router;
