const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config');

module.exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(404).send({
      message: 'Email ve Şifre boş bırakılamaz.'
    });
  } else {
    let reqEmail = req.body.email;
    let reqPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
    User.findOne({ email: reqEmail, password: reqPassword }, (err, user) => {
      if (err) {
        return res.status(404).send(err);
      } else if (!user) {
        return res.status(400).send('Böyle bir kullanıcı kaydı yoktur.');
      } else {
        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
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
        return res.status(200).send({ token: token, info });
      }
    });
  }
};

module.exports.register = (req, res) => {
  if (!req) {
    return res.sendStatus(404).send({ message: 'Boş nesne gönderilemez.' });
  } else {
    let userData = req.body;
    User.findOne({ email: userData.email }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).send(err);
      } else {
        if (user) {
          res.status(401).send({ message: 'Bu mail adresi daha önce kullanılmış.' });
        } else {
          const newUser = new User({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: crypto.createHash('md5').update(userData.password).digest('hex'),
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

module.exports.checkNickName = (req, res) => {
  if (!req.url) {
    return res.status(404).send({ message: 'Kullanıcı adı boş olamaz.' });
  } else {
    let nickName = req.query.nickName;
    User.find({ nickName: nickName }, (err, data) => {
      if (data.length > 0) {
        return res
          .status(400)
          .send({ message: 'Bu kullanıcı adı başka bir kişi tarafından kullanılmaktadır.' });
      } else {
        return res.status(200).send({ message: 'Bu kullanıcı adını kullanabilirsiniz.' });
      }
    });
  }
};

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

    req.id = decoded._id;
    next();
  });
};

// module.exports.decodeToken = async (req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send('Token tespit edilemedi');
//   }
//   const authorization = req.headers.authorization;
//   const token = authorization.split(' ')[1];

//   next();
// };
