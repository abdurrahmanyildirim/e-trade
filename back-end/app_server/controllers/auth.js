const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { TOKEN_KEY, company_name, origin } = require('../../config');
const { encrypt, comparePassword, hashPassword, decrypt } = require('../services/crypto');
const emailService = require('../services/email/index');
const { isDevMode } = require('../../common');

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
    const token = jwt.sign(
      {
        _id: user._id,
        email: decrypt(user.email),
        role: user.role
      },
      TOKEN_KEY,
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
    await newUser.save();
    const token = jwt.sign(
      {
        email: userData.email
      },
      TOKEN_KEY,
      {
        expiresIn: '360d'
      }
    );
    emailService.sendCustomEmail(
      userData.email,
      'Hesap Aktivasyonu',
      `
      <p> Merhaba ${userData.firstName} ${userData.lastName}</p>
      <p>Taşer züccaciye hesabınızı aktif hale getirmek için <a href="${origin}/#/auth/activate-email?v1=${token}" target="_blank" >tıklayınız.</a></p>
      <br>
      <p>${company_name}</p>
      `
    );
    return res.status(201).send({ message: 'Yeni kullanıcı oluşturuldu.' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports.activateEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, TOKEN_KEY);
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
      TOKEN_KEY,
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
  const token = jwt.sign(
    {
      _id: user._id
    },
    TOKEN_KEY + user.password,
    {
      expiresIn: '1h'
    }
  );
  emailService.sendCustomEmail(
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

    jwt.verify(token, TOKEN_KEY + user.password, (err, decoded) => {
      if (err) {
        return res.status(400).send({ message: 'Geçersiz anahtar!' });
      }
      password = hashPassword(password);
      User.updateOne({ _id: id }, { password }, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send({ message: 'Şifre değiştirildi.' });
      });
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const createLogin = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
      email: decrypt(user.email),
      role: user.role
    },
    TOKEN_KEY,
    {
      expiresIn: '360d'
    }
  );
  const info = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
  return { info, token };
};
