module.exports = {
  company_name: process.env.COMPANY,
  TOKEN_KEY: process.env.TOKEN_KEY,
  isMaillingActive: process.env.IS_MAILING_ACTIVE,
  crypto: {
    key: process.env.CRYPTO_KEY,
    iv: process.env.CRYPTO_IV,
    basicEncKey: process.env.CRYPTO_BASICENCKEY
  },
  mail: {
    transporter: {
      service: process.env.MAIL_SERVİCE,
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
      },
      from: process.env.MAIL_ADDRESS
    }
  },
  origin: process.env.ORIGIN,
  iyzipayConfig: {
    apiKey: process.env.API_KEY,
    secretKey: process.env.SECRET_KEY,
    uri: process.env.IYZIPAY_URI
  }
};
