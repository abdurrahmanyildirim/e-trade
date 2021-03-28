const Category = require('../models/category');
const Product = require('../models/product');

module.exports.getCategories = (req, res) => {
  Category.find({ isActive: true }, (err, categories) => {
    if (err) {
      return res.status(404).send({ message: 'Hata meydana geldi.' });
    }
    return res.status(200).send(categories);
  });
};

module.exports.remove = (req, res) => {
  const category = req.query.category;
  Category.findOneAndUpdate({ name: category }, { isActive: false }, (err, doc) => {
    if (err) {
      return res.status(500).send({ message: 'Bir hata meydana geldi' });
    }
    Product.find({ category: doc.name }, (err, products) => {
      products.forEach((product) => {
        product.isActive = false;
        const newProduct = new Product(product);
        newProduct.save((err) => {
          if (err) {
            return res.status(500).send({ message: 'Ürünler silinirken bir hata meydana geldi' });
          }
        });
      });
      return res.status(200).send({ message: 'Kategori silindi.' });
    });
  });
};

module.exports.insert = (req, res) => {
  const category = req.query.category;
  Category.find({ name: category }, (err, categories) => {
    if (err) {
      return res.status(500).send({ message: 'Bir hata meydana geldi' });
    }
    if (categories && categories.length > 0) {
      return res.status(400).send({ message: 'Bu kategori zaten mevcut' });
    }
    const newCategory = new Category({
      name: category,
      isActive: true
    });
    newCategory.save((err) => {
      if (err) {
        return res.status(500).send({ message: 'Bir hata meydana geldi' });
      }
      return res.status(200).send({ message: 'Yeni kategori eklendi.' });
    });
  });
};
