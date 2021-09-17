const cryptoService = require('./crypto');
const crucialKeys = new Map([
  ['password', 'password'],
  ['email', 'email'],
  ['address', 'address'],
  ['phone', 'phone'],
  ['confirmPassword', 'confirmPassword'],
  ['newPassword', 'newPassword']
]);

const bodyDecrypter = (req, res, next) => {
  const body = req.body;
  for (const key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      if (crucialKeys.has(key)) {
        const resolvedData = cryptoService.basicDecrypt(body[key]);
        req.body[key] = resolvedData;
      }
    }
  }
  next();
};

module.exports = {
  bodyDecrypter
};
