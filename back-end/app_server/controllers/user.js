const User = require('../models/user');
const { encrypt, comparePassword, hashPassword, encForResp } = require('../services/crypto');

module.exports.update = async (req, res, next) => {
  try {
    const { firstName, lastName, city, district, address, phone } = req.body;
    const user = await User.findOne({ _id: req.id });
    user.firstName = firstName;
    user.lastName = lastName;
    user.phones[0] = {
      title: 'phone' + Date.now(),
      phone: encrypt(phone)
    };
    user.addresses[0] = {
      title: 'address' + Date.now(),
      city: encrypt(city),
      district: encrypt(district),
      address: encrypt(address)
    };
    // user.email = encrypt(body.email);
    await user.save();
    return res.status(200).send({ message: 'Kullanıcı bilgileri güncellendi.' });
  } catch (error) {
    next(error);
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { confirmPassword, newPassword, password } = req.body;
    if (confirmPassword !== newPassword) {
      return res.status(400).send({ message: 'Girilen şifreler eşleşmiyor' });
    }
    const user = await User.findOne({ _id: req.id });
    const isCompared = comparePassword(password, user.password);
    if (!isCompared) {
      return res.status(401).send({ message: 'Girilen şifre hatalı' });
    }
    user.password = hashPassword(newPassword);
    await user.save();
    return res.status(200).send({ message: 'Şifreniz güncellendi.' });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const id = req.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
    }
    let newUser = {
      email: encForResp(user.email),
      firstName: user.firstName,
      lastName: user.lastName
    };
    if (user.addresses.length > 0 && user.phones.length > 0) {
      newUser = {
        ...newUser,
        city: encForResp(user.addresses[0].city),
        district: encForResp(user.addresses[0].district),
        address: encForResp(user.addresses[0].address),
        phone: encForResp(user.phones[0].phone)
      };
    }
    return res.status(200).send(newUser);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
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
    next(error);
  }
};
