const User = require('../models/user');
const { encrypt, decrypt } = require('../services/crypto');
const { isDevMode, isPresent } = require('../../common');
const { sendFormRequest } = require('../services/iyzipay');
const Iyzipay = require('iyzipay');
const Order = require('../models/order');

module.exports.updateCart = async (req, res) => {
  const user = await User.findOne({ _id: req.id });
  if (!user) {
    return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
  }
  const orders = req.body;
  if (!orders) {
    return res.status(400).send({ message: 'Siparişler boş bırakılamaz.' });
  }
  user.cart = orders.map((order) => {
    return { productId: order.productId, quantity: order.quantity };
  });
  user.save((err) => {
    if (err) {
      return res.status(404).send({ message: 'Kayıt sırasında bir hata meydana geldi.' });
    }
    return res.status(200).send({ message: 'Sepet güncellendi.' });
  });
};

module.exports.getCart = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id }).populate('cart.productId').exec();
    if (!user) {
      return res.status(400).send({ message: 'Kullanıcı bulunamadı' });
    }
    const orders = [];
    await user.cart.forEach((order) => {
      const prod = order.productId;
      orders.push({
        productId: prod._id,
        brand: prod.brand,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        discountRate: prod.discountRate,
        photo: prod.photos[0].path,
        quantity: order.quantity
      });
    });
    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Bir hata oluştu.' });
  }
};

module.exports.purchaseOrder = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id }).populate('cart.productId').exec();
    if (!user) {
      return res.status(500).send({ message: 'Kullanıcı bulunamadı' });
    }
    if (!isPresent(user.isActivated) || user.isActivated === false) {
      return res.status(400).send({ message: 'Mail adresi aktif değil', issue: 'mail' });
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
      }
    });
    user.phones[0] = {
      title: 'phone' + Date.now(),
      phone: encrypt(req.body.phone)
    };
    user.addresses[0] = {
      title: 'address' + Date.now(),
      city: encrypt(req.body.city),
      district: encrypt(req.body.district),
      address: encrypt(req.body.address)
    };
    await user.save();
    if (isDevMode()) {
      await giveOrder(req.id);
      return res.redirect(`http://localhost:4200/cart?status=true`);
    } else {
      const reqData = initIyzipayReqData(orderedProducts, user, req);
      const result = await sendFormRequest(reqData);
      return res.status(200).send(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
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

const initIyzipayReqData = (orderedProducts, user, req) => {
  const totalPrice = getTotalPrice(orderedProducts);
  const basketItems = getBasketItems(orderedProducts);
  const callbackUrl = getCallbackUrl(req);
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

const getTotalPrice = (prods) => {
  return prods.reduce(
    (sum, cur) => sum + (cur.price - cur.price * cur.discountRate) * cur.quantity,
    0
  );
};

const getBasketItems = (prods) => {
  return prods.map((prod) => {
    return {
      id: prod.productId + '',
      name: prod.name,
      category1: prod.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (prod.price - prod.price * prod.discountRate) * prod.quantity + ''
    };
  });
};

const getCallbackUrl = (req) => {
  return isDevMode()
    ? 'http://localhost:4205/api/iyzipay/callback?id=' + req.id
    : process.env.ORIGIN + '/api/iyzipay/callback?id=' + req.id;
};
