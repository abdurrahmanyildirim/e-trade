const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'er.web.etrade@gmail.com',
    pass: 'Tl9gse!23smxo4'
  }
});

const mailOptions = {
  from: 'er.web.etrade@gmail.com',
  to: 'abdurrahman.yildrm@gmail.com',
  subject: 'Email Test',
  text: 'Bu test emailidir'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
  }
  console.log(info);
});
