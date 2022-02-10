const { checkResult } = require('../services/iyzipay');
const User = require('../models/user');
const Order = require('../models/order');
const { decrypt } = require('../services/crypto');
const { sendEmail } = require('../services/email/index');

module.exports.iyzipayCallBack = async (req, res,next) => {
  try {
    const result = await checkResult(req.body.token);
    let params = '';
    const status = result.paymentStatus === 'SUCCESS' ? true : false;
    params += 'status=' + status;
    params += status ? '' : '&message=' + encodeURIComponent(result.errorMessage);
    if (status === true) {
      await giveOrder(req.query.id);
    }
    return res.redirect(`${process.env.ORIGIN}/cart?${params}`);
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
      let givenOrder = await newOrder.save();
      user.cart = [];
      await user.save();
      await sendEmail(
        decrypt(user.email),
        'Sipariş Bilgilendirme',
        givenOrder._id + ' numaralı siparişiniz Alındı. En kısa sürede işleme alınacaktır.'
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
