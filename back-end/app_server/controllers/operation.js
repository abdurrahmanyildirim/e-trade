const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const cryptoService = require('../services/crypto');

module.exports.updateCart = async (req, res) => {
  const user = await User.findOne({ _id: req.id });
  if (!user) {
    return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
  }
  const orders = req.body;
  if (!orders) {
    return res.status(400).send({ message: 'Siparişler boş bırakılamaz.' });
  }
  const newCart = orders.map((order) => {
    return { productId: order.productId, quantity: order.quantity };
  });
  user.cart = newCart;
  user.save((err) => {
    if (err) {
      return res.status(404).send({ message: 'Kayıt bir hata meydana geldi.' });
    }
    return res.status(200).send({ message: 'Sepet güncellendi.' });
  });
};

module.exports.getCart = (req, res) => {
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    Product.find((err, products) => {
      if (err) {
        return res.status(400).send({ message: 'Bir hata meydana geldi.' });
      }
      const orders = [];
      const cart = user.cart;
      cart.forEach((order) => {
        const product = products.find((prod) => order.productId == prod.id);
        if (product) {
          orders.push({
            productId: product._id,
            brand: product.brand,
            name: product.name,
            category: product.category,
            price: product.price,
            discountRate: product.discountRate,
            photo: product.photos[0].path,
            quantity: order.quantity
          });
        }
      });
      return res.status(200).send(orders);
    });
  });
};

module.exports.purchaseOrder = (req, res) => {
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    Product.find((err, products) => {
      if (err) {
        return res.status(400).send({ message: 'Bir hata meydana geldi.' });
      }
      const orderedProducts = [];
      const cart = user.cart;
      cart.forEach(async (order) => {
        const product = products.find((prod) => order.productId == prod.id);
        if (product) {
          orderedProducts.push({
            productId: product._id,
            quantity: order.quantity,
            name: product.name,
            brand: product.brand,
            discountRate: product.discountRate,
            price: product.price,
            photoPath: product.photos[0].path
          });
          product.stockQuantity = product.stockQuantity - order.quantity;
          await product.save();
        }
      });
      const city = cryptoService.encrypt(req.body.city);
      const district = cryptoService.encrypt(req.body.district);
      const address = cryptoService.encrypt(req.body.address);
      const phone = cryptoService.encrypt(req.body.phone);
      const newOrder = new Order({
        userId: req.id,
        userName: user.firstName + ' ' + user.lastName,
        email: user.email,
        isActive: true,
        date: Date.now(),
        status: [{ key: 0, desc: 'Siparişiniz alındı.', date: Date.now() }],
        products: orderedProducts,
        contractsChecked: req.body.contractsChecked,
        contactInfo: {
          city,
          district,
          address,
          phone
        }
      });
      newOrder.save((err) => {
        if (err) {
          return res.status(500).send({ message: 'Beklenmeyen bir hata meydana geldi.' });
        }
        user.cart = [];
        user.phones[0] = {
          title: 'phone' + Date.now(),
          phone
        };
        user.addresses[0] = {
          title: 'address' + Date.now(),
          city,
          district,
          address
        };
        user.save((err) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).send({ message: 'Sipariş verildi.' });
        });
      });
    });
  });
};
