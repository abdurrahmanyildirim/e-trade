const authRoute = require('./authRoute');
// const settingRoute = require('./settingRoute');
const productRoute = require('./productRoute');
const accountRoute = require('./accountRoute');
const fileUpload = require('express-fileupload');
const authController = require('../controllers/authController');
const operation = require('./operation');
const order = require('./order');
const category = require('./category');

module.exports = (app) => {
  app.use('/auth', authRoute);
  app.use('/product', productRoute);
  app.use(authController.verifyToken);
  app.use('/operation', operation);
  app.use('/order', order);
  app.use('/category', category);
  //   app.use(authController.decodeToken);
  //   app.use(fileUpload({ useTempFiles: true }));
  //   app.use('/account', accountRoute);
};
