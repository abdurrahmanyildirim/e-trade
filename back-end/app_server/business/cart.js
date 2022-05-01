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
    const orders = [];
    this.collection.cart.forEach((order) => {
      const prod = order.productId;
      orders.push({
        productId: prod._id,
        brand: prod.brand,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        discountRate: prod.discountRate,
        photoPath: prod.photos[0].path,
        quantity: order.quantity
      });
    });
    return orders;
  }
}

module.exports = { Cart };
