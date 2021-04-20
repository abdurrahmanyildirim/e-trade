const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config');
const {
  encrypt,
  comparePassword,
  hashPassword,
  decrypt,
  encForResp
} = require('../services/crypto');

module.exports.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(404).send({
      message: 'Email ve Şifre boş bırakılamaz.'
    });
  }
  let reqEmail = encrypt(req.body.email);
  User.findOne({ email: reqEmail }, (err, user) => {
    if (err) {
      return res.status(404).send(err);
    }
    if (!user) {
      return res.status(404).send('Böyle bir kullanıcı kaydı yoktur.');
    }
    const isCompared = comparePassword(req.body.password, user.password);
    if (!isCompared) {
      return res.status(404).send('Hatalı şifre veya email');
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: decrypt(user.email),
        role: user.role
      },
      config.TOKEN_KEY,
      {
        expiresIn: '360d'
      }
    );
    const info = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.status(200).send({ token, info });
  });
};

module.exports.register = async (req, res) => {
  try {
    if (!req.body) {
      return res.sendStatus(404).send({ message: 'Boş nesne gönderilemez.' });
    }
    let userData = req.body;
    const user = await User.findOne({ email: encrypt(userData.email) });
    if (user) {
      return res.status(404).send({ message: 'Bu mail adresi daha önce kullanılmış.' });
    }
    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: encrypt(userData.email),
      password: hashPassword(userData.password),
      authType: 'normal',
      role: 'Client'
    });
    await newUser.save();
    return res.status(201).send({ message: 'Yeni kullanıcı oluşturuldu.' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.googleAuth = (req, res) => {
  const { firstName, lastName, email } = req.body;
  User.findOne({ email: encrypt(email) }, async (err, user) => {
    if (err) {
      return res.status(500).send({ message: 'Bir hata meydana geldi.' });
    }
    if (!user) {
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: encrypt(email),
        password: hashPassword('a'),
        authType: 'google',
        role: 'Client'
      });
      user = await newUser.save();
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: email,
        role: user.role
      },
      config.TOKEN_KEY,
      {
        expiresIn: '360d'
      }
    );
    const info = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.status(200).send({ token, info });
  });
};

module.exports.getUser = (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(404).send({ message: 'Bağlantı hatası' });
    }
    const newUser = {
      email: encForResp(user.email),
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.status(200).send(newUser);
  });
};

module.exports.contactInfo = (req, res) => {
  const id = req.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(404).send({ message: 'Bağlantı hatası' });
    }
    let newUser = {};
    if (user.addresses.length > 0 && user.phones.length > 0) {
      newUser = {
        city: encForResp(user.addresses[0].city),
        district: encForResp(user.addresses[0].district),
        address: encForResp(user.addresses[0].address),
        phone: encForResp(user.phones[0].phone)
      };
    }
    return res.status(200).send(newUser);
  });
};
