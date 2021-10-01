const User = require('../models/user');
const {
  encrypt,
  basicEncrypt,
  comparePassword,
  hashPassword,
  encForResp
} = require('../services/crypto');

module.exports.updateContactInfo = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({ _id: req.id });
    if (!user) {
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
    await user.save();
    return res.status(200).send({
      phone: basicEncrypt(body.phone),
      city: basicEncrypt(body.city),
      district: basicEncrypt(body.district),
      address: basicEncrypt(body.address)
    });
  } catch (error) {
    return res.status(500).send(error);
  }
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

module.exports.getUser = async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
    }
    const newUser = {
      email: encForResp(user.email),
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.status(200).send(newUser);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
    }
    const newUser = {
      email: encForResp(user.email),
      firstName: user.firstName,
      lastName: user.lastName
    };
    return res.status(200).send(newUser);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.contactInfo = async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
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
  } catch (error) {
    return res.status(500).send(error);
  }
};
