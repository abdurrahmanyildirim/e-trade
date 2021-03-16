const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../../config');

const algo = 'aes-192-cbc';
const key = crypto.scryptSync(config.crypto.key, 'salt', 24);
const iv = Buffer.from(config.crypto.iv, 'utf8');

// bcrypt
const saltRounds = 10;

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algo, key, iv);
  var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;
};

const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv(algo, key, iv);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const basicEncrypt = (source) => {
  let encryptedString = '';
  for (let i = 0; i < source.length; i++) {
    const passOffset = i % config.crypto.basicEncKey.length;
    const calAscii = source.charCodeAt(i) + config.crypto.basicEncKey.charCodeAt(passOffset);
    encryptedString += String.fromCharCode(calAscii);
  }
  return encryptedString;
};

const basicDecrypt = (source) => {
  let decryptedCode = '';
  for (let i = 0; i < source.length; i++) {
    const passOffset = i % config.crypto.basicEncKey.length;
    const calAscii = source.charCodeAt(i) - config.crypto.basicEncKey.charCodeAt(passOffset);
    decryptedCode += String.fromCharCode(calAscii);
  }
  return decryptedCode;
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  comparePassword,
  basicEncrypt,
  basicDecrypt
};

// assert.strictEqual(decrypted, text);
