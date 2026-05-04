const nodemailer = require('nodemailer');

// Create transporter once and reuse it
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Port 587 uses STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps with certificate issues on some cloud hosts
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
});

const sendEmail = async (options) => {
  const message = {
    from: `${process.env.FROM_NAME || 'Blood Donation Portal'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};

module.exports = sendEmail;

