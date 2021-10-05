const User = require('../models/user');
const { company_name, origin } = require('../../config');
const { encrypt, comparePassword, hashPassword, decrypt } = require('../services/crypto');
const { sendCustomEmail } = require('../services/email/index');
const { sign, verify } = require('../services/jwt');

module.exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(404).send({
        message: 'Email ve Şifre boş bırakılamaz.'
      });
    }
    let reqEmail = encrypt(req.body.email);
    const user = await User.findOne({ email: reqEmail });
    if (!user) {
      return res.status(404).send('Böyle bir kullanıcı kaydı yoktur.');
    }
    const isMatched = comparePassword(req.body.password, user.password);
    if (!isMatched) {
      return res.status(404).send('Hatalı şifre veya email');
    }
    return res.status(200).send(createLogin(user));
  } catch (error) {
    return res.status(500).send(error);
  }
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
      authType: 'normal'
    });
    const createdUser = await newUser.save();
    const authData = createLogin(createdUser);
    activationMail(userData, authData.token);
    return res.status(201).send(authData);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.activateEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = verify(token, '');
    const email = decoded.email;
    const user = await User.findOne({ email: encrypt(email) });
    if (!user) {
      return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
    }
    user.isActivated = true;
    await user.save();
    return res.status(200).send(createLogin(user));
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.googleAuth = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findOne({ email: encrypt(email) });
    if (!user) {
      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: encrypt(email),
        isActivated: true,
        password: hashPassword('a'),
        authType: 'google',
        role: 'Client'
      });
      user = await newUser.save();
    }
    return res.status(200).send(createLogin(user));
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.changePasswordRequest = async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email: encrypt(email) });
  if (!user) {
    return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
  }
  const token = sign({ _id: user._id }, '1h', user.password);
  sendCustomEmail(
    email,
    'Şifre Sıfırlama',
    `
    <p> Merhaba ${user.firstName} ${user.lastName}</p>
    <p>İsteğiniz üzerine, şifre değiştirme linki gönderilmiştir.</p>
    <p>Şifrenizi değiştirmek için <a href="${origin}/#/auth/change-password?v1=${token}&id=${user._id}" target="_blank" >tıklayınız.</a></p>
    <br>
    <p>${company_name}</p>
    `
  );
  return res.status(200).send();
};

module.exports.changePassword = async (req, res) => {
  try {
    let { id, password, token } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
    }
    verify(token, user.password);
    password = hashPassword(password);
    await User.updateOne({ _id: id }, { password });
    return res.status(200).send({ message: 'Şifre değiştirildi.' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.sendActivationMail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id });
    if (!user) {
      return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
    }
    const userData = {
      email: decrypt(user.email),
      firstName: user.firstName,
      lastName: user.lastName
    };
    activationMail(userData, req.auth_token);
    return res.status(200).send({ message: 'Aktivasyon maili gönderildi.' });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const activationMail = (user, token) => {
  sendCustomEmail(
    user.email,
    'Hesap Aktivasyonu',
    `
    <p> Merhaba ${user.firstName} ${user.lastName}</p>
    <p>Taşer züccaciye hesabınızı aktif hale getirmek için <a href="${origin}/#/auth/activate-email?v1=${token}" target="_blank" >tıklayınız.</a></p>
    <br>
    <p>${company_name}</p>
    `
  );
};

const createLogin = (user) => {
  const token = sign({ _id: user._id, email: decrypt(user.email), role: user.role }, '360d', '');
  const info = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
  return { info, token };
};
