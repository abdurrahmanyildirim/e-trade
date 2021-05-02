const Product = require('../models/product');

let io = null;

module.exports.init = (instance) => {
  io = instance;
  io.on('connection', () => {
    // console.log('Bağlantı Kuruldu');
  });
};

module.exports.updateProducts = async () => {
  const products = await Product.find({ isActive: true });
  io.emit('product-change', products);
};
