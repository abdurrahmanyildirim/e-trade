const jwt = require('jsonwebtoken');
const config = require('../../config');
const roles = {
  admin: 'Admin',
  client: 'Client',
  unauth: 'Unauth'
};

const isAdmin = (req, res, next) => {
  if (req.role !== roles.admin) {
    return res.status(401).send({ message: 'Yetkisiz işlem' });
  } else {
    next();
  }
};

const isClient = (req, res, next) => {
  if (req.role !== roles.client) {
    return res.status(401).send({ message: 'Yetkisiz işlem' });
  } else {
    next();
  }
};

const roleResolver = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    req.role = roles.unauth;
    next();
    return;
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
    if (err) {
      req.role = roles.unauth;
      next();
      return;
    }
    req.id = decoded._id;
    req.role = decoded.role;
    next();
  });
};

module.exports = {
  roleResolver,
  isAdmin,
  isClient
};
