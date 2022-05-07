const { isPresent } = require('../../common');
const Order = require('../business/order');

module.exports.getOrders = async (req, res, next) => {
  try {
    const order = await new Order().initByUserId(req.id);
    const orders = order.getOrders();
    return res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};

module.exports.orderDetail = async (req, res, next) => {
  try {
    const id = req.query.id;
    const order = await new Order().initById(id);
    if (!order.collection) {
      return res.status(404).send({ message: 'Siparişler bulunamadı' });
    }
    const orderDetail = order.getOrderDetail();
    return res.status(200).send(orderDetail);
  } catch (error) {
    next(error);
  }
};

module.exports.allOrders = async (req, res, next) => {
  try {
    const order = await new Order().initAll();
    const orders = order.getOrders();
    return res.status(200).send(orders);
  } catch (error) {
    next(error);
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
  return res.status(200).send(statusesDb);
};

module.exports.updateStatus = async (req, res, next) => {
  try {
    const { status, id, cargo, inform } = req.body;
    if (!id || !status) {
      return res.status(404).send({ message: 'Hatalı api isteği' });
    }
    const order = await new Order().initById(id);
    if (!order.collection) {
      return res.status(500).send({ message: 'Sipariş bulunamadı.' });
    }
    order.addStatus(status);
    if (isPresent(cargo)) {
      order.collection.cargo = cargo;
    }
    await order.save();
    if (inform) {
      await order.informUser(status);
    }
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};
