const Category = require('../models/category');

module.exports.getCategories = (req, res) => {
  Category.find({ isActive: true }, (err, categories) => {
    if (err) {
      return res.status(404).send({ message: 'Hata meydana geldi.' });
    }
    return res.status(200).send(categories);
  });
};

module.exports.removeCategory = (req, res) => {
  const id = req.query.id;
  Category.findOneAndUpdate({ _id: id }, { isActive: false }, (err, doc) => {
    console.log(doc);
    if (err) {
      return res.status(500).send({ message: 'Bir hata meydana geldi' });
    }
    return res.status(200).send({ message: 'Kategori silindi.' });
  });
};

module.exports.addCategory = (req, res) => {
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
