const nodemailer = require('nodemailer');

// Read SMTP config from env
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

let transporter;
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  // Fallback transporter that logs messages to console
  transporter = {
    sendMail: async (opts) => {
      console.log('Mailer fallback - email not sent. Mail contents:');
      console.log(opts);
      return Promise.resolve();
    }
  };
}

async function sendMail({ to, subject, text, html }) {
  const from = FROM_EMAIL || (SMTP_USER ? SMTP_USER : 'no-reply@example.com');
  try {
    await transporter.sendMail({ from, to, subject, text, html });
  } catch (err) {
    console.error('Error sending mail:', err);
    throw err;
  }
}

module.exports = { sendMail };
