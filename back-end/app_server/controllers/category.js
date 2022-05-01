const { Category } = require('../business/category');
const { Product } = require('../business/product');

module.exports.getCategories = async (req, res, next) => {
  try {
    const category = await new Category().initActives();
    return res.status(200).send(category.collection);
  } catch (error) {
    next(error);
  }
};

module.exports.remove = async (req, res, next) => {
  try {
    const category = req.query.category;
    let doc = await new Category().initByName({ name: category });
    doc = await doc.hideCategory().save();
    const product = await new Product().initByCategory(category);
    await product.deActivateProducts().saveArray();
    const categories = (await doc.initActives()).collection;
    return res.status(200).send({ message: 'Kategori silindi.', categories });
  } catch (error) {
    next(error);
  }
};

module.exports.insert = async (req, res, next) => {
  try {
    const categoryName = req.query.category;
    const category = await new Category().initByName({ name: categoryName });
    if (!category) {
      return res.status(500).send({ message: 'Bir hata meydana geldi' });
    }
    if (category.collection) {
      return res.status(400).send({ message: 'Bu kategori zaten mevcut' });
    }
    await category.createNewCategory(categoryName).save();
    const categoryList = await category.getActiveCategories();
    return res.status(200).send({ message: 'Yeni kategori eklendi.', categories: categoryList });
  } catch (error) {
    next(error);
  }
};
