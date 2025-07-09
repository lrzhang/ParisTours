const formData = require('form-data');
const Mailgun = require('mailgun.js');

const sendEmail = async (options) => {
  // 1) Initialize Mailgun
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ParisTours <noreply@paristours.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message.replace(/\n/g, '<br>'), // Convert line breaks to HTML
  };

  // 3) Send the email
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, mailOptions);
    console.log('Email sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

module.exports = sendEmail;
