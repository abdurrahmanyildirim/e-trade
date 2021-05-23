const auth = require('./auth');
const product = require('./product');
const account = require('./photo');
const cart = require('./cart');
const order = require('./order');
const category = require('./category');
const contact = require('./contact');
const user = require('./user');

module.exports = (app) => {
  app.use('/auth', auth);
  app.use('/product', product);
  app.use('/category', category);
  app.use('/contact', contact);
  app.use('/cart', cart);
  app.use('/user', user);
  app.use('/order', order);
  app.use('/photo', account);
};
