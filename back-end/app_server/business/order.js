const Business = require('./index');
const OrderModel = require('../models/order');

// const Order = require('../models/order');
const User = require('../models/user');
const { remove } = require('../services/cloudinary');
const { updateProducts } = require('../services/socket');

class Order extends Business {
  constructor() {
    super(OrderModel);
  }
}

module.exports = Order;
