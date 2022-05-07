const { User } = require('./user');
const { encrypt, decrypt } = require('../services/crypto');
const { isDevMode, isPresent } = require('../../common');
const { sendFormRequest } = require('../services/iyzipay');
const Iyzipay = require('iyzipay');
const Order = require('../models/order');

class Cart extends User {
  constructor() {
    super();
  }

  updateCart({ orders }) {
    this.collection.cart = orders.map((order) => {
      return { productId: order.productId, quantity: order.quantity };
    });
    return this;
  }

  async initByIdWithOrders(id) {
    this.collection = await this.mainModel.findOne({ _id: id }).populate('cart.productId').exec();
    return this;
  }

  getCart() {
    return this.collection.cart.map((order) => {
      const prod = order.productId;
      return {
        productId: prod._id,
        brand: prod.brand,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        discountRate: prod.discountRate,
        photoPath: prod.photos[0].path,
        quantity: order.quantity
      };
    });
  }

  getOrderedProduct(order, product) {
    return {
      productId: product._id,
      quantity: order.quantity,
      name: product.name,
      brand: product.brand,
      discountRate: product.discountRate,
      price: product.price,
      photoPath: product.photos[0].path,
      category: product.category
    };
  }

  async updateProductAfterPurchaseAndGetOrders() {
    const orderedProducts = [];
    for (const order of this.collection.cart) {
      const product = order.productId;
      const orderedProduct = this.getOrderedProduct(order, product);
      orderedProducts.push(orderedProduct);
      product.stockQuantity = product.stockQuantity - order.quantity;
      await product.save();
    }
    return orderedProducts;
  }

  reset() {
    this.collection.cart = [];
    return this;
  }
}

module.exports = { Cart };
