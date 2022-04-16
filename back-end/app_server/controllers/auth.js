const { Auth, emailType, authType } = require('../business/auth');

module.exports.login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(404).send({
        message: 'Email ve Şifre boş bırakılamaz.'
      });
    }
    const { email, password } = req.body;
    const auth = await new Auth().initByEmail(email);
    if (!auth.collection) {
      return res.status(404).send('Böyle bir kullanıcı kaydı yoktur.');
    }
    const isMatched = auth.comparePassword(password);
    if (!isMatched) {
      return res.status(404).send('Hatalı şifre veya email');
    }
    const payload = auth.createAuthPayload();
    return res.status(200).send(payload);
  } catch (error) {
    next(error);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.sendStatus(404).send({ message: 'Boş nesne gönderilemez.' });
    }
    const { firstName, lastName, email, password } = req.body;
    let auth = await new Auth().initByEmail(email);
    if (auth.collection) {
      return res.status(404).send({ message: 'Bu mail adresi daha önce kullanılmış.' });
    }
    auth = await auth
      .createNewUser({
        firstName,
        lastName,
        email,
        password,
        authType: authType.normal
      })
      .save();
    const payload = auth.createAuthPayload();
    await auth.sendEmail({ type: emailType.activation, token: payload.token });
    return res.status(201).send(payload);
  } catch (error) {
    next(error);
  }
};

module.exports.activateEmail = async (req, res, next) => {
  try {
    const token = req.query.token;
    let auth = new Auth().verify({ token, ekstraKey: '' });
    auth = await auth.initByEmail(auth.decodedToken.email);
    if (!auth.collection) {
      return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
    }
    await auth.activate().save();
    const payload = auth.createAuthPayload();
    return res.status(200).send(payload);
  } catch (error) {
    next(error);
  }
};

module.exports.googleAuth = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    let auth = await new Auth().initByEmail(email);
    if (!auth.collection) {
      auth = await auth
        .createNewUser({
          firstName: firstName,
          lastName: lastName,
          email: email,
          isActivated: true,
          password: 'a',
          authType: authType.google,
          role: 'Client'
        })
        .save();
    }
    const payload = auth.createAuthPayload();
    return res.status(200).send(payload);
  } catch (error) {
    next(error);
  }
};

module.exports.changePasswordRequest = async (req, res) => {
  const email = req.query.email;
  const auth = await new Auth().initByEmail(email);
  if (!auth.collection) {
    return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
  }
  const token = auth.createChangePasswordToken();
  await auth.sendEmail({ type: emailType.changePassword, token });
  return res.status(200).send();
};

module.exports.changePassword = async (req, res, next) => {
  try {
    let { id, password, token } = req.body;
    const auth = await new Auth().initById(id);
    if (!auth.collection) {
      return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
    }
    auth = auth.verify({ token, ekstraKey: '' });
    // auth.verifyToken(token);
    password = auth.hashPassword(password);
    await auth.changePassword(password).save();
    return res.status(200).send({ message: 'Şifre değiştirildi.' });
  } catch (error) {
    next(error);
  }
};

module.exports.sendActivationMail = async (req, res, next) => {
  try {
    const auth = await new Auth().initById(req.id);
    if (!auth.collection) {
      return res.status(400).send({ message: 'Böyle bir kullanıcı yok' });
    }
    auth = await auth.sendEmail({ type: emailType.activation, token: req.auth_token });
    return res.status(200).send({ message: 'Aktivasyon maili gönderildi.' });
  } catch (error) {
    next(error);
  }
};
