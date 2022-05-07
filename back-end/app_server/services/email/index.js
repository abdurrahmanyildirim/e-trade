const nodemailer = require('nodemailer');
const { mail, company_name, isMaillingActive } = require('../../../config');
const { headerContent, footerContent } = require('./template');

const transporter = nodemailer.createTransport(mail.transporter);

// transporter.verify(function (error, success) {
//   if (error) {
//     isMaillingActive = false;
//     console.log(error);
//   } else {
//     isMaillingActive = true;
//   }
// });

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

const sendEmail = async ({ emailType, payload, to }) => {
  try {
    const subject = emailSubject[emailType];
    const desc = emailDesc[emailType](payload);
    await sendMail({ to, subject, html: desc }, false);
  } catch (error) {
    console.log(error);
  }
};

const sendCustomEmail = async ({ emailType, payload, to }) => {
  try {
    const subject = emailSubject[emailType];
    const desc = emailDesc[emailType](payload);
    await sendMail({ to, subject, html: desc }, true);
  } catch (error) {
    console.log(error);
  }
};

const sendMail = ({ to, subject, html }, isCustom) => {
  if (!isMaillingActive) {
    return;
  }
  const options = {
    from: {
      name: company_name,
      address: mail.transporter.from
    },
    sender: mail.transporter.from,
    attachments: isCustom ? [] : attachments,
    to,
    subject,
    html,
    text: html
  };
  return transporter.sendMail(options);
};

const emailType = Object.freeze({
  activation: 'activation',
  changePassword: 'changePassword',
  informOrder: 'informOrder'
});

const emailSubject = Object.freeze({
  activation: 'Hesap Aktivasyonu',
  changePassword: 'Şifre Sıfırlama',
  informOrder: 'Sipariş Bilgilendirme'
});

const emailDesc = Object.freeze({
  activation: ({ user, token }) => `
      <p> Merhaba ${user.firstName} ${user.lastName}</p>
      <p>Taşer züccaciye hesabınızı aktif hale getirmek için <a href="${origin}/auth/activate-email?v1=${token}" target="_blank" >tıklayınız.</a></p>
      <br>
      <p>${company_name}</p>
      `,
  changePassword: ({ user, token }) => `
      <p> Merhaba ${user.firstName} ${user.lastName}</p>
      <p>İsteğiniz üzerine, şifre değiştirme linki gönderilmiştir.</p>
      <p>Şifrenizi değiştirmek için <a href="${origin}/auth/change-password?v1=${token}&id=${user._id}" target="_blank" >tıklayınız.</a></p>
      <br>
      <p>${company_name}</p>
      `,
  informOrder: ({ order, status }) => {
    let desc = order._id + statuses[status.key] + '';
    if (status.key === 2) {
      desc +=
        '<p> Kargo Şirketi : ' +
        order.cargo.company +
        '</p>Kargo Numarası : ' +
        order.cargo.no +
        '</p>';
    }
    return headerContent + desc + footerContent;
  }
});

const statuses = Object.freeze({
  '-1': ' numaralı siparişiniz iptal Edildi',
  0: ' numaralı iparişiniz Alındı. En kısa sürede işleme alınacaktır.',
  1: ' numaralı siparişiniz Hazırlanıyor',
  2: ' numaralı siparişiniz Kargoya Verildi',
  3: ' numaralı siparişiniz Teslim Edildi'
});

module.exports = {
  sendEmail,
  sendCustomEmail,
  emailType
};
