const nodemailer = require('nodemailer');
const { mail, company_name, isMaillingActive } = require('../../../config');
const { headerContent, footerContent } = require('./template');

const transporter = nodemailer.createTransport(mail.transporter);

const attachments = [
  {
    filename: 'logo.png',
    path: `${__dirname}/${process.env.NODE_ENV}/logo.png`,
    cid: 'logo' //same cid value as in the html img src
  },
  {
    filename: 'insta.png',
    path: `${__dirname}/images/insta.png`,
    cid: 'insta' //same cid value as in the html img src
  },
  {
    filename: 'facebook.png',
    path: `${__dirname}/images/facebook.png`,
    cid: 'facebook' //same cid value as in the html img src
  }
];

module.exports.sendEmail = async (to, subject, desc) => {
  try {
    await sendMail({ to, subject, html: headerContent + desc + footerContent });
  } catch (error) {
    console.log(error);
  }
};

module.exports.sendCustomEmail = async ({ to, subject, desc }) => {
  try {
    await sendMail({ to, subject, html: desc });
  } catch (error) {
    console.log(error);
  }
};

const sendMail = ({ to, subject, html }) => {
  if (isMaillingActive === 'false' || isMaillingActive === false) {
    return;
  }
  const options = {
    from: {
      name: company_name,
      address: mail.transporter.from
    },
    sender: mail.transporter.from,
    attachments,
    to,
    subject,
    html
  };
  return transporter.sendMail(options);
};
