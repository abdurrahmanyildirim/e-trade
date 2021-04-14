const User = require('../models/user');
const { encrypt, basicEncrypt, comparePassword, hashPassword } = require('../services/crypto');

module.exports.updateContactInfo = (req, res) => {
  const body = req.body;
  User.findOne({ _id: req.id }, (err, user) => {
    if (err) {
      return res.status(401).send({ message: 'Kullanıcı bulunamadı' });
    }
    user.phones[0] = {
      title: 'phone' + Date.now(),
      phone: encrypt(body.phone)
    };
    user.addresses[0] = {
      title: 'address' + Date.now(),
      city: encrypt(body.city),
      district: encrypt(body.district),
      address: encrypt(body.address)
    };
    user.save((err) => {
      if (err) {
        return res.status(401).send({ message: 'Güncelleme sırasında bir hata oldu' });
      }
      return res.status(200).send({
        phone: basicEncrypt(body.phone),
        city: basicEncrypt(body.city),
        district: basicEncrypt(body.district),
        address: basicEncrypt(body.address)
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
    user.email = encrypt(body.email);
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
    const isCompared = comparePassword(body.password, user.password);
    if (!isCompared) {
      return res.status(401).send({ message: 'Girilen şifre hatalı' });
    }
    const newPassword = hashPassword(body.newPassword);
    user.password = newPassword;
    user.save((err) => {
      if (err) {
        return res.status(500).send({ message: 'Güncelleme sırasında bir hata oldu.' });
      }
      return res.status(200).send({ message: 'Şifreniz güncellendi.' });
    });
  });
};
