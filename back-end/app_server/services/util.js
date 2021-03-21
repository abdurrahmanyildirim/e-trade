const cryptoService = require('./crypto');
const crucialKeys = new Map([
  ['password', 'password'],
  ['email', 'email'],
  ['address', 'address'],
  ['phone', 'phone']
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

const isDevMode = () => {
  return isPresent(process.env.NODE_ENV) && process.env.NODE_ENV.trim() === 'development';
};

const isPresent = (obj) => {
  return obj !== undefined && typeof obj !== 'undefined' && obj !== null;
};

module.exports = {
  bodyDecrypter,
  isDevMode,
  isPresent
};
