const User = require('../models/user');
const cryptoService = require('../services/crypto');

module.exports.updateContactInfo = (req, res) => {
  const body = req.body;
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(401).send({ message: 'Kullanıcı bulunamadı' });
    }
    user.phones[0] = {
      title: 'phone' + Date.now(),
      phone: cryptoService.encrypt(body.phone)
    };
    user.addresses[0] = {
      title: 'address' + Date.now(),
      city: cryptoService.encrypt(body.city),
      district: cryptoService.encrypt(body.district),
      address: cryptoService.encrypt(body.address)
    };
    user.save((err) => {
      if (err) {
        return res.status(401).send({ message: 'Güncelleme sırasında bir hata oldu' });
      }
      return res.status(200).send({
        phone: cryptoService.basicEncrypt(body.phone),
        city: cryptoService.basicEncrypt(body.city),
        district: cryptoService.basicEncrypt(body.district),
        address: cryptoService.basicEncrypt(body.address)
      });
    });
  });
};

module.exports.updateGeneralInfo = (req, res) => {
  const body = req.body;
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(401).send({ message: 'Kullanıcı bulunamadı' });
    }
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.email = cryptoService.encrypt(body.email);
    User.find({ email: user.email }, (err, users) => {
      if (err) {
        return res.status(500).send({ message: 'Güncelleme sırasında bir hata oldu.' });
      }
      if (users.length > 0 && (users.length > 1 || users[0]._id !== req.id)) {
        return res.status(401).send({ message: 'Bu email adresi kullanılmaktadır.' });
      }
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: 'Güncelleme sırasında bir hata oldu.' });
        }
        return res.status(200).send({ message: 'Kullanıcı bilgileri güncellendi.' });
      });
    });
  });
};

module.exports.updatePassword = (req, res) => {
  const body = req.body;
  if (body.confirmPassword !== body.newPassword) {
    return res.status(400).send({ message: 'Girilen şifreler eşleşmiyor' });
  }
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: 'Güncelleme sırasında bir hata oldu.' });
    }
    const isCompared = cryptoService.comparePassword(body.password, user.password);
    if (!isCompared) {
      return res.status(401).send({ message: 'Girilen şifre hatalı' });
    }
    const newPassword = cryptoService.hashPassword(body.newPassword);
    user.password = newPassword;
    user.save((err) => {
      if (err) {
        return res.status(500).send({ message: 'Güncelleme sırasında bir hata oldu.' });
      }
      return res.status(200).send({ message: 'Şifreniz güncellendi.' });
    });
  });
};
