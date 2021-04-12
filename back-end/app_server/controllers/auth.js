const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config');
const cryptoService = require('../services/crypto');

module.exports.login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(404).send({
      message: 'Email ve Şifre boş bırakılamaz.'
    });
  } else {
    let reqEmail = cryptoService.encrypt(req.body.email);
    User.findOne({ email: reqEmail }, (err, user) => {
      if (err) {
        return res.status(404).send(err);
      }
      if (!user) {
        return res.status(404).send('Böyle bir kullanıcı kaydı yoktur.');
      }
      const isCompared = cryptoService.comparePassword(req.body.password, user.password);
      if (!isCompared) {
        return res.status(404).send('Hatalı şifre veya email');
      }

      const token = jwt.sign(
        {
          _id: user._id,
          email: cryptoService.decrypt(user.email),
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
  }
};

module.exports.register = (req, res) => {
  if (!req.body) {
    return res.sendStatus(404).send({ message: 'Boş nesne gönderilemez.' });
  } else {
    let userData = req.body;
    User.findOne({ email: cryptoService.encrypt(userData.email) }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(404).send(err);
      }
      if (user) {
        return res.status(404).send({ message: 'Bu mail adresi daha önce kullanılmış.' });
      }
      const newUser = new User({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: cryptoService.encrypt(userData.email),
        password: cryptoService.hashPassword(userData.password),
        authType: 'normal',
        role: 'Client'
      });
      newUser.save((err) => {
        if (err) {
          return res.status(404).send(err);
        }
        return res.status(201).send({ message: 'Yeni kullanıcı oluşturuldu.' });
      });
    });
  }
};

module.exports.googleAuth = (req, res) => {
  const { firstName, lastName, email } = req.body;
  User.findOne({ email: cryptoService.encrypt(email) }, async (err, user) => {
    if (err) {
      return res.status(500).send({ message: 'Bir hata meydana geldi.' });
    }
    if (!user) {
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: cryptoService.encrypt(email),
        password: cryptoService.hashPassword('a'),
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
      email: cryptoService.basicEncrypt(cryptoService.decrypt(user.email)),
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
        city: cryptoService.basicEncrypt(cryptoService.decrypt(user.addresses[0].city)),
        district: cryptoService.basicEncrypt(cryptoService.decrypt(user.addresses[0].district)),
        address: cryptoService.basicEncrypt(cryptoService.decrypt(user.addresses[0].address)),
        phone: cryptoService.basicEncrypt(cryptoService.decrypt(user.phones[0].phone))
      };
    }
    return res.status(200).send(newUser);
  });
};
