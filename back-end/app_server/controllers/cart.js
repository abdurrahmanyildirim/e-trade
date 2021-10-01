const User = require('../models/user');
const Product = require('../models/product');
const { encrypt, decrypt } = require('../services/crypto');
const { isDevMode } = require('../../common');
const { sendFormRequest } = require('../services/iyzipay');
var Iyzipay = require('iyzipay');

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

module.exports.getCart = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id });
    if (!user) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    const productIds = await user.cart.map((order) => order.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    if (!products) {
      return res.status(500).send({ message: 'Bir hata meydana geldi.' });
    }
    const orders = [];
    await user.cart.forEach((order) => {
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
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Bir hata oluştu.' });
  }
};

module.exports.purchaseOrder = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id });
    if (!user) {
      return res.status(500).send({ message: 'Kullanıcı bulunamadı' });
    }
    const productIds = await user.cart.map((order) => order.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    if (!products) {
      return res.status(500).send({ message: 'Bir hata meydana geldi.' });
    }
    const orderedProducts = [];
    await user.cart.forEach(async (order) => {
      const product = products.find((prod) => order.productId == prod.id);
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
      }
    });
    const city = encrypt(req.body.city);
    const district = encrypt(req.body.district);
    const address = encrypt(req.body.address);
    const phone = encrypt(req.body.phone);
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
    await user.save();
    const reqData = initIyzipayReqData(orderedProducts, user, req);
    const result = await sendFormRequest(reqData);
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

const initIyzipayReqData = (orderedProducts, user, req) => {
  const totalPrice = orderedProducts.reduce(
    (sum, cur) => sum + (cur.price - cur.price * cur.discountRate) * cur.quantity,
    0
  );
  const basketItems = orderedProducts.map((prod) => {
    return {
      id: prod.productId + '',
      name: prod.name,
      category1: prod.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (prod.price - prod.price * prod.discountRate) * prod.quantity + ''
    };
  });
  const callbackUrl = isDevMode()
    ? 'http://localhost:4205/iyzipay/callback?id=' + req.id
    : process.env.ORIGIN + '/iyzipay/callback?id=' + req.id;
  return {
    price: totalPrice + '',
    paidPrice: totalPrice + '',
    currency: Iyzipay.CURRENCY.TRY,
    callbackUrl,
    enabledInstallments: [1, 2, 3, 6], // Taksit Seçenekleri
    buyer: {
      id: user._id + '',
      name: user.firstName,
      surname: user.lastName,
      gsmNumber: '+90' + req.body.phone.split(' ').join(''), // Zorunlu değil
      email: decrypt(user.email), // Üye işyeri tarafındaki alıcıya ait e-posta bilgisi. E-posta adresi alıcıya ait geçerli ve erişilebilir bir adres olmalıdır.
      identityNumber: '11111111111', // Üye işyeri tarafındaki alıcıya ait kimlik (TCKN) numarası.
      registrationAddress: `${req.body.address} - ${req.body.district}/${req.body.city}`,
      ip: req.ip, // Üye işyeri tarafındaki alıcıya ait IP adresi.
      city: req.body.city,
      country: 'Turkey'
    },
    shippingAddress: {
      contactName: `${user.firstName} ${user.lastName}`, // Üye işyeri tarafındaki teslimat adresi ad soyad bilgisi. Sepetteki ürünlerden en az 1 tanesi fiziksel ürün (itemType=PHYSICAL) ise zorunludur.
      city: req.body.city, // 	Üye işyeri tarafındaki teslimat adresi şehir bilgisi. Sepetteki ürünlerden en az 1 tanesi fiziksel ürün (itemType=PHYSICAL) ise zorunludur.
      country: 'Turkey',
      address: `${req.body.address} - ${req.body.district}/${req.body.city}`
    },
    billingAddress: {
      contactName: `${user.firstName} ${user.lastName}`,
      city: req.body.city,
      country: 'Turkey',
      address: `${req.body.address} - ${req.body.district}/${req.body.city}`
    },
    basketItems
  };
};
