const { hashPassword, decrypt } = require('../services/crypto');
const { sendCustomEmail, emailType } = require('../services/email/index');
const { sign, verify } = require('../services/jwt');
const { User } = require('./user');

class Auth extends User {
  decodedToken;
  constructor() {
    super();
  }

  verify({ token, ekstraKey }) {
    this.decodedToken = verify(token, ekstraKey);
    return this;
  }

  createAuthToken = () => {
    const { _id, email, role } = this.collection;
    return sign({ _id: _id, email: decrypt(email), role: role }, '360d', '');
  };

  createChangePasswordToken = () => {
    return sign({ _id: this.collection._id }, '1h', this.collection.password);
  };

  createAuthPayload() {
    const { email, firstName, lastName } = this.collection;
    return {
      info: {
        email: decrypt(email),
        firstName,
        lastName
      },
      token: this.createAuthToken()
    };
  }

  async sendActivationMail({ token }) {
    const { email } = this.collection;
    await sendCustomEmail({
      emailType: emailType.activation,
      payload: { user: this.collection, token },
      to: email
    });
  }

  async sendChangePasswordMail({ token }) {
    await sendCustomEmail({
      emailType: emailType.changePassword,
      payload: { user: this.collection, token },
      to: email
    });
  }

  hashPassword({ password }) {
    return hashPassword(password);
  }

  changePassword({ password }) {
    this.collection.password = password;
    return this;
  }

  verifyToken(token) {
    return verify(token, this.collection.password);
  }
}

const authType = Object.freeze({
  normal: 'normal',
  google: 'google'
});

module.exports = {
  authType,
  Auth
};
