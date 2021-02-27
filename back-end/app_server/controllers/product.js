const Product = require('../models/product');
const cloudinaryService = require('../services/cloudinary');

module.exports.getProducts = (req, res) => {
  Product.find({ isActive: true }, (err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getAllProducts = (req, res) => {
  Product.find((err, products) => {
    if (err) {
      return res.status(404).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send(products);
  });
};

module.exports.getByCategory = (req, res) => {
  const category = req.query.category;
  Product.find({ category, isActive: true }, (err, products) => {
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

module.exports.remove = async (req, res) => {
  const id = req.query.id;
  const product = await Product.findOne({ _id: id });
  Product.findByIdAndRemove(id, async (err) => {
    if (err) {
      return res.status(404).send({ message: 'Ürün silinirken hata oldu.' });
    }
    for (const photo of product.photos) {
      try {
        await cloudinaryService.remove(photo.publicId);
      } catch (error) {
        console.log(error);
        console.log('Foto Silinemedi');
      }
    }
    return res.status(200).send({ message: 'Ürün silindi' });
  });
};

module.exports.update = (req, res) => {
  const product = req.body;
  Product.findByIdAndUpdate({ _id: product._id }, product, (err) => {
    if (err) {
      return res.status(401).send({ message: 'Bir hata meydana geldi.' });
    }
    res.status(200).send({ message: 'Güncelleme başarılı' });
  });
};
