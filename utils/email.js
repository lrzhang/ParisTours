const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Lee Zhang <leezhangsc@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  });
};

module.exports = sendEmail;
