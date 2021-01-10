const User = require('../models/user');
const Product = require('../models/product');

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
  // return res.status(200).send({ message: 'Başarılı' });
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
      //   console.log(products);
      //   console.log(cart);
      cart.forEach((order) => {
        const product = products.find((prod) => order.productId == prod.id);
        if (product) {
          orders.push({
            productId: product._id,
            brand: product.brand,
            name: product.name,
            category: product.category,
            price: product.price,
            dicountRate: product.dicountRate,
            photo: product.photos[0].path,
            quantity: order.quantity
          });
        }
      });
      return res.status(200).send(orders);
    });

    // const orders = req.body;
    // const newCart = orders.map((order) => {
    //   return { productId: order.productId, quantity: order.quantity };
    // });
    // user.cart = newCart;
    // user.save((err) => {
    //   if (err) {
    //     return res.status(404).send({ message: 'Kayıt bir hata meydana geldi.' });
    //   }
    //   return res.status(200).send({ message: 'Sepet güncellendi.' });
    // });
  });
};
