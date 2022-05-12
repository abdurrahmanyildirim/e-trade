const { isDevMode, isPresent } = require('../../common');
const { isPaymentActive } = require('../../config');
const { sendFormRequest } = require('../services/iyzipay');
const { Cart } = require('../business/cart');
const Order = require('../business/order');

module.exports.updateCart = async (req, res, next) => {
  try {
    const user = await new Cart().initById(req.id);
    if (!user.collection) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    const orders = req.body;
    if (!orders) {
      return res.status(400).send({ message: 'Siparişler boş bırakılamaz.' });
    }
    await user.updateCart({ orders }).save();
    return res.status(200).send({ message: 'Sepet güncellendi.' });
  } catch (error) {
    next(error);
  }
};

module.exports.getCart = async (req, res, next) => {
  try {
    const user = await new Cart().initByIdWithOrders(req.id);
    if (!user.collection) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    const cart = user.getCart();
    return res.status(200).send(cart);
  } catch (error) {
    next(error);
  }
};

module.exports.purchaseOrder = async (req, res, next) => {
  try {
    const user = await new Cart().initByIdWithOrders(req.id);
    if (!user.collection) {
      return res.status(500).send({ message: 'Kullanıcı bulunamadı' });
    }
    if (!isPresent(user.collection.isActivated) || user.collection.isActivated === false) {
      return res.status(400).send({ message: 'Mail adresi aktif değil', issue: 'mail' });
    }
    const orderedProducts = user.getCart();
    const { phone, city, district, address } = req.body;
    await user.changePhone({ phone }).changeAdress({ city, address, district }).save();
    if (isDevMode() || !isPaymentActive) {
      await new Order().giveOrder(req.id);
      return res.status(200).send();
    } else {
      const result = await sendFormRequest({
        products: orderedProducts,
        user: user.collection,
        req
      });
      return res.status(200).send(result);
    }
  } catch (error) {
    next(error);
  }
};
