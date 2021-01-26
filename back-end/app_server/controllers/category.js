const Category = require('../models/category');

module.exports.getCategories = (req, res) => {
  Category.find((err, categories) => {
    if (err) {
      return res.status(404).send({ message: 'Hata meydana geldi.' });
    }
    return res.status(200).send(categories);
  });
};
