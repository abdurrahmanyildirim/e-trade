const Business = require('./index');
const CategoryModel = require('../models/category');

class Category extends Business {
  constructor() {
    super(CategoryModel);
  }

  async initByName({ name }) {
    this.collection = await this.mainModel.findOne({ name });
    return this;
  }

  hideCategory() {
    this.collection.isActive = false;
    return this;
  }

  hideCategories() {
    this.collection.forEach((doc) => {
      doc.isActive = false;
    });
    return this;
  }

  async initActives() {
    this.collection = await this.mainModel.find({ isActive: true });
    return this;
  }

  createNewCategory(categoryName) {
    this.collection = new CategoryModel({
      name: categoryName,
      isActive: true
    });
    return this;
  }

  getActiveCategories() {
    return CategoryModel.find({ isActive: true });
  }
}

module.exports = { Category };
