const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Manually resolve to IPv4 address to bypass ENETUNREACH (IPv6) issues on cloud hosts
  let host = 'smtp.gmail.com';
  try {
    const dns = require('dns').promises;
    const lookup = await dns.lookup('smtp.gmail.com', { family: 4 });
    host = lookup.address;
    console.log('Resolved smtp.gmail.com to IPv4:', host);
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
      servername: 'smtp.gmail.com',
    },
    pool: true,
    maxConnections: 3,
    connectionTimeout: 30000, // Increased to 30 seconds
    socketTimeout: 45000,
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

