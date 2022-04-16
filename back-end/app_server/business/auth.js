// const User = require('../models/user');
const { company_name, origin } = require('../../config');
const { encrypt, comparePassword, hashPassword, decrypt } = require('../services/crypto');
const { sendCustomEmail } = require('../services/email/index');
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

  async sendEmail({ type, token }) {
    const { email } = this.collection;
    await sendCustomEmail({
      to: decrypt(email),
      subject: emailSubject[type],
      desc: emailDesc[type](this.collection, token)
    });
    return this;
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

const emailType = {
  activation: 'activation',
  changePassword: 'changePassword'
};

const authType = {
  normal: 'normal',
  google: 'google'
};

const emailSubject = {
  activation: 'Hesap Aktivasyonu',
  changePassword: 'Şifre Sıfırlama'
};

const emailDesc = {
  activation: (user, token) => `
      <p> Merhaba ${user.firstName} ${user.lastName}</p>
      <p>Taşer züccaciye hesabınızı aktif hale getirmek için <a href="${origin}/auth/activate-email?v1=${token}" target="_blank" >tıklayınız.</a></p>
      <br>
      <p>${company_name}</p>
      `,
  changePassword: (user, token) => `
      <p> Merhaba ${user.firstName} ${user.lastName}</p>
      <p>İsteğiniz üzerine, şifre değiştirme linki gönderilmiştir.</p>
      <p>Şifrenizi değiştirmek için <a href="${origin}/auth/change-password?v1=${token}&id=${user._id}" target="_blank" >tıklayınız.</a></p>
      <br>
      <p>${company_name}</p>
      `
};

module.exports = {
  emailType,
  authType,
  Auth
};
