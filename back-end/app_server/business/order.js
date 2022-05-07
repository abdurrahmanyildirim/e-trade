const Business = require('./index');
const OrderModel = require('../models/order');
const { encForResp, decrypt } = require('../services/crypto');
const { sendEmail, emailType } = require('../services/email/index');
const { Cart } = require('./cart');

class Order extends Business {
  constructor() {
    super(OrderModel);
  }

  async initByUserId(userId) {
    this.collection = await OrderModel.find({ userId });
    return this;
  }

  async initAll() {
    this.collection = await OrderModel.find();
    return this;
  }

  getOrders() {
    return this.collection.map((order) => {
      order.contactInfo = this.getrEncriptedContactInfo(order.contactInfo);
      return order;
    });
  }

  getrEncriptedContactInfo(contactInfo) {
    const { city, district, address, phone } = contactInfo;
    return {
      city: encForResp(city),
      district: encForResp(district),
      address: encForResp(address),
      phone: encForResp(phone)
    };
  }

  addStatus(status) {
    this.collection.status.push({
      key: status.key,
      desc: status.desc,
      date: Date.now()
    });
    return this;
  }

  getOrderDetail() {
    const contactInfo = this.getrEncriptedContactInfo(this.collection.contactInfo);
    const { userId, userName, email, products, date, isActive, status, cargo } = this.collection;
    return {
      userId,
      userName,
      email: encForResp(email),
      date,
      products,
      isActive,
      status,
      contactInfo,
      cargo
    };
  }

  async informUser(status) {
    const order = this.collection;
    await sendEmail({
      emailType: emailType.informOrder,
      payload: { order, status },
      to: decrypt(order.email)
    });
  }

  createNewOrder({ user, products }) {
    this.collection = new OrderModel({
      userId: user._id,
      userName: user.firstName + ' ' + user.lastName,
      email: user.email,
      status: [{ key: 0, desc: 'Siparişiniz alındı.', date: Date.now() }],
      products,
      contactInfo: {
        city: user.addresses[0].city,
        district: user.addresses[0].district,
        address: user.addresses[0].address,
        phone: user.phones[0].phone
      }
    });
    return this;
  }

  async giveOrder(id) {
    const cart = await new Cart().initByIdWithOrders(id);
    if (!cart.collection) {
      throw 'Kullanıcı bulunamadı';
    }
    const orderedProducts = await cart.updateProductAfterPurchaseAndGetOrders();
    await this.createNewOrder({
      user: cart.collection,
      products: orderedProducts
    }).save();
    await cart.reset().save();
    await this.informUser({ key: 0 });
  }
}

module.exports = Order;
