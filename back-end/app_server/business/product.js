const Business = require('./index');
const ProductModel = require('../models/product');

class Product extends Business {
  constructor() {
    super(ProductModel);
  }

  async initByCategory(category) {
    this.collection = await this.mainModel.find({ category });
    return this;
  }

  deActivateProducts() {
    this.collection.forEach(async (product) => {
      product.isActive = false;
    });
    return this;
  }
}

module.exports = { Product };
