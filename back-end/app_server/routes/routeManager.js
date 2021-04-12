const authRoute = require('./auth');
const productRoute = require('./product');
const accountRoute = require('./photo');
const operation = require('./operation');
const order = require('./order');
const category = require('./category');
const contact = require('./contact');
const user = require('./user');

module.exports = (app) => {
  app.use('/auth', authRoute);
  app.use('/product', productRoute);
  app.use('/category', category);
  app.use('/contact', contact);
  app.use('/operation', operation);
  app.use('/user', user);
  app.use('/order', order);
  app.use('/photo', accountRoute);
};
