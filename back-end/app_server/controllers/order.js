const Order = require('../models/order');
const { encForResp, decrypt } = require('../services/crypto');
const email = require('../services/email/index');

module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.id });
    orders.map((order) => {
      const contactInfo = {
        city: encForResp(order.contactInfo.city),
        district: encForResp(order.contactInfo.district),
        address: encForResp(order.contactInfo.address),
        phone: encForResp(order.contactInfo.phone)
      };
      order.contactInfo = contactInfo;
      return order;
    });
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.orderDetail = async (req, res) => {
  try {
    const id = req.query.id;
    const order = await Order.findOne({ _id: id });
    if (!order) {
      return res.status(404).send({ message: 'Siparişler bulunamadı' });
    }
    const orderedProducts = [];
    order.products.map((product) => {
      orderedProducts.push({
        _id: product._id,
        productId: product.productId,
        quantity: product.quantity,
        discountRate: product.discountRate,
        price: product.price,
        photoPath: product.photoPath,
        brand: product.brand,
        name: product.name,
        comment: {
          rate: product.comment.rate ? product.comment.rate : 0,
          desc: product.comment.desc ? product.comment.desc : ''
        }
      });
    });
    const contactInfo = {
      city: encForResp(order.contactInfo.city),
      district: encForResp(order.contactInfo.district),
      address: encForResp(order.contactInfo.address),
      phone: encForResp(order.contactInfo.phone)
    };
    return res.status(200).send({
      userId: order.userId,
      userName: order.userName,
      email: encForResp(order.email),
      date: order.date,
      products: orderedProducts,
      isActive: order.isActive,
      status: order.status,
      contactInfo
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.allOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    orders.map((order) => {
      const contactInfo = {
        city: encForResp(order.contactInfo.city),
        district: encForResp(order.contactInfo.district),
        address: encForResp(order.contactInfo.address),
        phone: encForResp(order.contactInfo.phone)
      };
      order.contactInfo = contactInfo;
      return order;
    });
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const statusesDb = [
  {
    key: -1,
    desc: 'İptal Edildi'
  },
  {
    key: 0,
    desc: 'Siparişiniz Alındı'
  },
  {
    key: 1,
    desc: 'Siparişiniz Hazırlanıyor'
  },
  {
    key: 2,
    desc: 'Kargoya Verildi'
  },
  {
    key: 3,
    desc: 'Teslim Edildi'
  }
];

module.exports.getStatuses = (req, res) => {
  // Status.find((err, statuses) => {
  //   if (err) {
  //     return res.status(400).send({ message: 'Veritabanı hatasi' });
  //   }
  //   return res.status(200).send(statuses);
  // });
  return res.status(200).send(statusesDb);
};

module.exports.updateStatus = async (req, res) => {
  try {
    const id = req.query.id;
    const status = req.body;
    if (!id || !status) {
      return res.status(404).send({ message: 'Hatalı api isteği' });
    }
    const order = await Order.findOne({ _id: id });
    if (!order) {
      return res.status(500).send({ message: 'Veri tabanı hatası' });
    }
    order.status.push({
      key: status.key,
      desc: status.desc,
      date: Date.now()
    });
    const newOrder = new Order(order);
    await newOrder.save();
    await sendEmail(newOrder, status);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({ message: err });
  }
};

const sendEmail = async (order, status) => {
  await email.sendEmail(
    decrypt(order.email),
    'Sipariş Bilgilendirme',
    order._id + statuses[status.key] + ''
  );
};

const statuses = {
  '-1': ' numaralı siparişiniz iptal Edildi',
  0: ' numaralı iparişiniz Alındı. En kısa sürede işleme alınacaktır.',
  1: ' numaralı siparişiniz Hazırlanıyor',
  2: ' numaralı siparişiniz Kargoya Verildi',
  3: ' numaralı siparişiniz Teslim Edildi'
};
