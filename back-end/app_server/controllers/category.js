const Category = require('../models/category');
const Product = require('../models/product');

module.exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    return res.status(200).send(categories);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const category = req.query.category;
    const doc = await Category.findOneAndUpdate({ name: category }, { isActive: false });
    const products = await Product.find({ category: doc.name });
    products.forEach(async (product) => {
      product.isActive = false;
      const newProduct = new Product(product);
      await newProduct.save();
    });
    const categories = await Category.find({ isActive: true });
    return res.status(200).send({ message: 'Kategori silindi.', categories });
  } catch (error) {
    next(error);
  }
};

module.exports.insert = async (req, res, next) => {
  try {
    const category = req.query.category;
    const categories = await Category.find({ name: category });
    if (!categories) {
      return res.status(500).send({ message: 'Bir hata meydana geldi' });
    }
    if (categories && categories.length > 0) {
      return res.status(400).send({ message: 'Bu kategori zaten mevcut' });
    }
    const newCategory = await new Category({
      name: category,
      isActive: true
    }).save();
    if (!newCategory) {
      return res.status(500).send({ message: 'Bir hata meydana geldi' });
    }
    const categoryList = await Category.find({ isActive: true });
    return res.status(200).send({ message: 'Yeni kategori eklendi.', categories: categoryList });
  } catch (error) {
    next(error);
  }
};
