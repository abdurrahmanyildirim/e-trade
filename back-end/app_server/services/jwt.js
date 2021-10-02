const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../../config');

const sign = (payload, expire, ekstraKey = '') => {
  return jwt.sign(payload, TOKEN_KEY + ekstraKey, {
    expiresIn: expire
  });
};

const verify = (token, ekstraKey) => {
  return jwt.verify(token, TOKEN_KEY + ekstraKey);
};

module.exports = {
  sign,
  verify
};
