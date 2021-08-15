module.exports = {
  company_name: 'Taşer Züccaciye',
  TOKEN_KEY: process.env.TOKEN_KEY,
  crypto: {
    key: process.env.CRYPTO_KEY,
    iv: process.env.CRYPTO_IV,
    basicEncKey: process.env.CRYPTO_BASICENCKEY
  },
  mail: {
    transporter: {
      service: 'Yandex',
      host: 'ayildirim.site',
      auth: {
        user: 'info@ayildirim.site',
        pass: process.env.MAIL_PASSWORD
      },
      from: 'info@ayildirim.site'
    }
  },
  domain: 'http://localhost:4200'
};
