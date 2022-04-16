const { User } = require('../business/user');

module.exports.update = async (req, res, next) => {
  try {
    const { firstName, lastName, city, district, address, phone } = req.body;
    const user = await new User().initById(req.id);
    if (!user.collection) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
    }
    await user
      .changeFirstAndLastName({ firstName, lastName })
      .changePhone({ phone })
      .changeAdress({ address, city, district })
      .save();
    return res.status(200).send({ message: 'Kullanıcı bilgileri güncellendi.' });
  } catch (error) {
    next(error);
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { confirmPassword, newPassword, password } = req.body;
    const user = await new User().initById(req.id);
    if (confirmPassword !== newPassword) {
      return res.status(400).send({ message: 'Girilen şifreler eşleşmiyor' });
    }
    const isCompared = user.comparePassword(password);
    if (!isCompared) {
      return res.status(401).send({ message: 'Girilen şifre hatalı' });
    }
    await user.changePassword(newPassword).save();
    return res.status(200).send({ message: 'Şifreniz güncellendi.' });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await new User().initById(req.id);
    if (!user.collection) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
    }
    const userInfo = user.getInfo();
    return res.status(200).send(userInfo);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await new User().initById(req.id);
    if (!user.collection) {
      return res.status(404).send({ message: 'Kullanıcı bulunamadı' });
    }
    const userInfo = user.getInfo();
    return res.status(200).send(userInfo);
  } catch (error) {
    next(error);
  }
};
