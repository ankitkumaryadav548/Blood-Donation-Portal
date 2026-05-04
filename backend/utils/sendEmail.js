const https = require('https');

const sendEmail = async (options) => {
  const data = JSON.stringify({
    sender: { 
      name: process.env.FROM_NAME || 'Blood Donation Portal', 
      email: 'ankityadav02032003@gmail.com' // Using your verified Brevo sender
    },
    to: [{ email: options.email }],
    subject: options.subject,
    textContent: options.message,
    htmlContent: options.html,
  });

  const apiOptions = {
    hostname: 'api.brevo.com',
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'api-key': process.env.EMAIL_PASS,
      'x-sib-api-key': process.env.EMAIL_PASS,
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  console.log('Attempting to send email with API key starting with:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 8) + '...' : 'MISSING');

  return new Promise((resolve, reject) => {
    const req = https.request(apiOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const response = JSON.parse(body);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Email sent via Brevo API:', response.messageId);
          resolve(response);
        } else {
          console.error('Brevo API Error:', response);
          reject(new Error(response.message || 'Email sending failed'));
        }
      });
    });

    req.on('error', (error) => {
      console.error('HTTPS Request Error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

module.exports = sendEmail;

