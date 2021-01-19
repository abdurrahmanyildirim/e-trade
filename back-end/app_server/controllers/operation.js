const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const { use } = require('../routes/authRoute');

module.exports.updateCart = (req, res, next) => {
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    const orders = req.body;
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
      cart.forEach((order) => {
        const product = products.find((prod) => order.productId == prod.id);
        if (product) {
          orderedProducts.push({
            productId: product._id,
            quantity: cart.quantity,
            discountRate: product.discountRate,
            price: product.price
          });
        }
      });
      const newOrder = new Order({
        userId: req.id,
        isActive: true,
        date: Date.now(),
        status: [{ key: 0, desc: 'Siparişiniz alındı.', date: Date.now() }],
        products: orderedProducts,
        contactInfo: {
          city: req.body.city,
          district: req.body.district,
          address: req.body.address,
          phone: req.body.phone
        }
      });
      newOrder.save((err) => {
        if (err) {
          return res.status(404).send({ message: 'Beklenmeyen bir hata meydana geldi.' });
        }
        user.cart = [];
        user.phones[0] = {
          title: 'phone' + Date.now(),
          phone: req.body.phone
        };
        user.addresses[0] = {
          title: 'address' + Date.now(),
          city: req.body.city,
          district: req.body.district,
          address: req.body.address
        };
        const newUser = new User(user);
        newUser.save((err) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).send({ message: 'Sipariş verildi.' });
        });
      });
    });
  });
};
