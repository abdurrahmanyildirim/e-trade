const Product = require('../models/product');
const { isDevMode } = require('../../common');

let io = null;

module.exports.init = (instance) => {
  io = instance;
  io.on('connection', () => {
    if (isDevMode()) {
      console.log('Socket bağlantısı kuruldu');
    }
  });
};

module.exports.updateProducts = async () => {
  const products = await Product.find({ isActive: true });
  io.emit('product-change', products);
};
