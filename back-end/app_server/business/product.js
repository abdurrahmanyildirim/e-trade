const Business = require('./index');
const ProductModel = require('../models/product');
const { remove } = require('../services/cloudinary');
const { updateProducts } = require('../services/socket');

class Product extends Business {
  constructor() {
    super(ProductModel);
  }

  async initByCategory(category) {
    this.collection = await ProductModel.find({ category });
    return this;
  }

  async initActives() {
    this.collection = await ProductModel.find({ isActive: true });
    return this;
  }

  async initAll() {
    this.collection = await ProductModel.find();
    return this;
  }

  async initActivesByCategory(category) {
    this.collection = await ProductModel.find({ category, isActive: true });
    return this;
  }

  async removeById(id) {
    const doc = await ProductModel.findByIdAndRemove(id);
    for (let i = 0; i < doc.photos.length; i++) {
      if (i === 0) {
        continue;
      }
      try {
        await remove(doc.photos[i]._id);
      } catch (error) {
        console.log(error);
        console.log('Foto Silinemedi');
      }
    }
    updateProducts();
    return this;
  }

  async updateById(product) {
    await ProductModel.findByIdAndUpdate({ _id: product._id }, product);
    updateProducts();
    return this;
  }

  getProductsWithStockInfo(products) {
    return products.map((product) => {
      const dbProduct = this.collection.find((prod) => prod.id === product.id);
      if (dbProduct) {
        const hasEnoughStock =
          product.quantity > 0 &&
          dbProduct.stockQuantity > 0 &&
          dbProduct.stockQuantity >= product.quantity;
        return {
          isActive: dbProduct.isActive,
          hasEnoughStock,
          availableQuantity: dbProduct.stockQuantity,
          id: dbProduct._id,
          quantity: product.quantity,
          name: dbProduct.name
        };
      }
    });
  }

  createNewProduct(product) {
    const newProduct = {
      ...product,
      discountRate: product.discountRate / 100,
      rate: 0,
      isActive: true,
      comments: []
    };
    this.collection = new ProductModel(newProduct);
    return this;
  }

  deActivateProducts() {
    for (const prod of this.collection) {
      prod.isActive = false;
    }
    return this;
  }

  getComment({ userId, orderId }) {
    return this.collection.comments.find(
      (comment) => comment.userId.toString() === userId && comment.orderId.toString() === orderId
    );
  }

  insertComment({ userId, orderId, description, rate, name }) {
    this.collection.comments.push({
      orderId,
      userId: userId,
      name,
      description,
      rate
    });
    return this;
  }

  updateProductRate() {
    const comments = this.collection.comments;
    const totalRate = comments.reduce((acc, { rate }) => acc + rate, 0);
    this.collection.rate = Number.parseFloat((totalRate / comments.length).toFixed(2));
    return this;
  }
}

module.exports = Product;
