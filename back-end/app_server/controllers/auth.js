const crypto = require('crypto');
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
      } else if (!user) {
        return res.status(404).send('Böyle bir kullanıcı kaydı yoktur.');
      } else {
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
      }
    });
  }
};

module.exports.register = (req, res) => {
  if (!req.body) {
    return res.sendStatus(404).send({ message: 'Boş nesne gönderilemez.' });
  } else {
    let userData = req.body;
    User.findOne({ email: userData.email }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(404).send(err);
      } else {
        if (user) {
          res.status(404).send({ message: 'Bu mail adresi daha önce kullanılmış.' });
        } else {
          const newUser = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: cryptoService.encrypt(userData.email),
            password: cryptoService.hashPassword(userData.password),
            role: 'Client'
          });
          newUser.save((err) => {
            if (err) {
              return res.status(404).send(err);
            }
            return res.status(201).send({ message: 'Yeni kullanıcı oluşturuldu.' });
          });
        }
      }
    });
  }
};

module.exports.getUser = (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(404).send({ message: 'Bağlantı hatası' });
    }
    const newUser = {
      email: user.email,
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
        city: user.addresses[0].city,
        district: user.addresses[0].district,
        address: user.addresses[0].address,
        phone: user.phones[0].phone
      };
    }
    return res.status(200).send(newUser);
  });
};

// TODO : Verify işlemleri servislere taşınacak

module.exports.verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'Yetkisiz işlem' });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Geçersiz anahtar');
    }
    req.id = decoded._id;
    next();
  });
};

const roles = {
  admin: 'Admin',
  client: 'Client'
};

module.exports.verifyAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'Yetkisiz işlem' });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Geçersiz anahtar');
    }
    const role = decoded.role;
    if (role !== roles.admin) {
      return res.status(404).send({ message: 'Yetkisiz işlem' });
    }
    next();
  });
};
