const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Using smtp.googlemail.com as an alternative to smtp.gmail.com
  let host = 'smtp.googlemail.com';
  try {
    const dns = require('dns').promises;
    const lookup = await dns.lookup('smtp.googlemail.com', { family: 4 });
    host = lookup.address;
    console.log('Resolved smtp.googlemail.com to IPv4:', host);
  } catch (dnsErr) {
    console.error('DNS Lookup failed, falling back to hostname:', dnsErr);
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: 587,
    secure: false, // Port 587 uses STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      servername: 'smtp.googlemail.com',
    },
    connectionTimeout: 40000, 
    greetingTimeout: 40000,
    socketTimeout: 60000,
  });

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

