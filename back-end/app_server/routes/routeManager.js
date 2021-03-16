const authRoute = require('./auth');
const productRoute = require('./product');
const accountRoute = require('./photo');
const fileUpload = require('express-fileupload');
const authController = require('../controllers/auth');
const operation = require('./operation');
const order = require('./order');
const category = require('./category');
const contact = require('./contact');

module.exports = (app) => {
  app.use('/auth', authRoute);
  app.use('/product', productRoute);
  app.use('/category', category);
  app.use('/contact', contact);
  app.use(authController.verifyToken);
  app.use('/operation', operation);
  app.use('/order', order);
  app.use(fileUpload({ useTempFiles: true }));
  app.use('/photo', accountRoute);
};
