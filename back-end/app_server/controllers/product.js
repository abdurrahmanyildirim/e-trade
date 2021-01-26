const Product = require('../models/product');

module.exports.getProducts = (req, res) => {
  Product.find((err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getCategories = (req, res) => {};

module.exports.getByCategory = (req, res) => {
  const category = req.query.category;
  Product.find({ category }, (err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi.' });
    }
    return res.status(200).send(products);
  });
};
