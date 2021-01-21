const order = require('../models/order');
const Order = require('../models/order');

module.exports.getOrders = (req, res) => {
  Order.find({ userId: req.id }, (err, orders) => {
    if (err) {
      return res.status(404).send({ message: 'Siparişler bulunamadı' });
    }
    return res.status(200).send(orders);
  });
};
