const Product = require('../models/product');

module.exports.getProducts = (req, res) => {
  Product.find((err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getByCategory = (req, res) => {
  const category = req.query.category;
  Product.find({ category }, (err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi.' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getProductById = (req, res) => {
  const id = req.query.id;
  Product.findOne({ _id: id }, (err, product) => {
    if (err) {
      return res.status(404).send();
    }
    return res.status(200).send(product);
  });
};

module.exports.addNewProduct = (req, res) => {
  const newProduct = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    discountRate: req.body.discountRate,
    stockQuantity: req.body.stockQuantity,
    brand: req.body.brand,
    rate: 0,
    isActive: true,
    photos: req.body.photos,
    comments: []
  };

  const product = new Product(newProduct);
  product.save((err) => {
    if (err) {
      return res.status(400).send({ message: 'Ekleme sırasında hata meydana geldi' });
    }
    return res.status(200).send({ message: 'Ürün eklendi.' });
  });
};

module.exports.remove = (req, res) => {
  const id = req.query.id;
  Product.findByIdAndRemove(id, (err) => {
    if (err) {
      return res.status(404).send({ message: 'Ürün silirken hata oldu.' });
    }
    return res.status(200).send({ message: 'Ürün silindi' });
  });
};

module.exports.changeSituation = (req, res) => {
  const id = req.query.id;
  Product.findOne({ _id: id }, (err, dbProduct) => {
    if (err) {
      return res.status(400).send({ message: 'Veri tabanı hatası' });
    }
    dbProduct.isActive = !dbProduct.isActive;
    const product = new Product(dbProduct);
    product.save((err) => {
      if (err) {
        return res.status(400).send({ message: 'Veri tabanı hatası' });
      }
      return res.status(200).send({ isActive: dbProduct.isActive });
    });
  });
};
