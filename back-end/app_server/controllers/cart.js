const User = require('../models/user');
const { isDevMode, isPresent } = require('../../common');
const { sendFormRequest } = require('../services/iyzipay');
const Order = require('../models/order');

const { Cart } = require('../business/cart');

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
    if (isDevMode()) {
      // TODO : Düzenlenecek
      await giveOrder(req.id);
      return res.redirect(`http://localhost:4200/cart?status=true`);
    } else {
      const result = await sendFormRequest({ products: orderedProducts, user, req });
      return res.status(200).send(result);
    }
  } catch (error) {
    next(error);
  }
};

const giveOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id }).populate('cart.productId').exec();
      if (!user) {
        reject('Kullanıcı bulunamadı');
      }
      const orderedProducts = [];
      await user.cart.forEach(async (order) => {
        const product = order.productId;
        if (product) {
          orderedProducts.push({
            productId: product._id,
            quantity: order.quantity,
            name: product.name,
            brand: product.brand,
            discountRate: product.discountRate,
            price: product.price,
            photoPath: product.photos[0].path,
            category: product.category
          });
          product.stockQuantity = product.stockQuantity - order.quantity;
          await product.save();
        }
      });
      const newOrder = new Order({
        userId: id,
        userName: user.firstName + ' ' + user.lastName,
        email: user.email,
        isActive: true,
        date: Date.now(),
        status: [{ key: 0, desc: 'Siparişiniz alındı.', date: Date.now() }],
        products: orderedProducts,
        contractsChecked: true,
        contactInfo: {
          city: user.addresses[0].city,
          district: user.addresses[0].district,
          address: user.addresses[0].address,
          phone: user.phones[0].phone
        }
      });
      await newOrder.save();
      user.cart = [];
      await user.save();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
