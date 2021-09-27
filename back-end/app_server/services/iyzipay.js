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

const sendFormRequest = (request) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  checkResult,
  sendFormRequest
};
