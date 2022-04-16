const Iyzipay = require('iyzipay');
const { iyzipayConfig } = require('../../config');

const iyzipay = new Iyzipay(iyzipayConfig);

const checkResult = (token) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const sendFormRequest = ({ products, user, req }) => {
  const requestOpt = getFormReqOpt(products, user, req);
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(requestOpt, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const getFormReqOpt = (products, user, req) => {
  const totalPrice = fixFloatNumber(getTotalPrice(products));
  const basketItems = getBasketItems(products);
  const callbackUrl = getCallbackUrl(req);
  const { _id, firstName, lastName, email } = user;
  const { phone, address, district, city } = req.body;
  return {
    price: totalPrice + '',
    paidPrice: totalPrice + '',
    currency: Iyzipay.CURRENCY.TRY,
    callbackUrl,
    enabledInstallments: [1, 2, 3, 6], // Taksit Seçenekleri
    buyer: {
      id: _id + '',
      name: firstName,
      surname: lastName,
      gsmNumber: '+90' + phone.split(' ').join(''), // Zorunlu değil
      email: decrypt(email), // Üye işyeri tarafındaki alıcıya ait e-posta bilgisi. E-posta adresi alıcıya ait geçerli ve erişilebilir bir adres olmalıdır.
      identityNumber: '11111111111', // Üye işyeri tarafındaki alıcıya ait kimlik (TCKN) numarası.
      registrationAddress: `${address} - ${district}/${city}`,
      ip: req.ip, // Üye işyeri tarafındaki alıcıya ait IP adresi.
      city: city,
      country: 'Turkey'
    },
    shippingAddress: {
      contactName: `${firstName} ${lastName}`, // Üye işyeri tarafındaki teslimat adresi ad soyad bilgisi. Sepetteki ürünlerden en az 1 tanesi fiziksel ürün (itemType=PHYSICAL) ise zorunludur.
      city: city, // 	Üye işyeri tarafındaki teslimat adresi şehir bilgisi. Sepetteki ürünlerden en az 1 tanesi fiziksel ürün (itemType=PHYSICAL) ise zorunludur.
      country: 'Turkey',
      address: `${address} - ${district}/${city}`
    },
    billingAddress: {
      contactName: `${firstName} ${lastName}`,
      city: city,
      country: 'Turkey',
      address: `${address} - ${district}/${city}`
    },
    basketItems
  };
};

const fixFloatNumber = (num) => {
  return Number.parseFloat(num.toFixed(10));
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

module.exports = {
  checkResult,
  sendFormRequest
};
