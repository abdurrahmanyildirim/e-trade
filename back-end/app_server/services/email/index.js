const nodemailer = require('nodemailer');
const config = require('../../../config');
const { headerContent, footerContent } = require('./template');

const transporter = nodemailer.createTransport(config.mail.transporter);

const attachments = [
  {
    filename: 'logo.png',
    path: `${__dirname}/images/logo.png`,
    cid: 'logo' //same cid value as in the html img src
  },
  {
    filename: 'tw.png',
    path: `${__dirname}/images/tw.png`,
    cid: 'tw' //same cid value as in the html img src
  },
  {
    filename: 'insta.png',
    path: `${__dirname}/images/insta.png`,
    cid: 'insta' //same cid value as in the html img src
  },
  {
    filename: 'link.png',
    path: `${__dirname}/images/link.png`,
    cid: 'link' //same cid value as in the html img src
  },
  {
    filename: 'facebook.png',
    path: `${__dirname}/images/facebook.png`,
    cid: 'facebook' //same cid value as in the html img src
  }
];

module.exports.sendEmail = async (to, subject, desc) => {
  try {
    const options = {
      from: {
        name: config.company_name,
        address: config.mail.transporter.from
      },
      sender: config.mail.transporter.from,
      to,
      subject,
      attachments,
      html: headerContent + desc + footerContent
    };
    await transporter.sendMail(options);
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendCustomEmail = async (to, subject, desc) => {
  try {
    const options = {
      from: {
        name: config.company_name,
        address: config.mail.transporter.from
      },
      sender: config.mail.transporter.from,
      to,
      subject,
      html: desc
    };
    await transporter.sendMail(options);
  } catch (error) {
    console.log(error);
  }
};
