const nodemailer = require('nodemailer');

// Read SMTP config from env
const { 
  SMTP_HOST, 
  SMTP_PORT, 
  SMTP_USER, 
  SMTP_PASS, 
  FROM_EMAIL,
  FROM_NAME // Name to display in email (e.g., "HR Team")
} = process.env;

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
      console.log('📧 ========== MAILER FALLBACK (Console Log) ==========');
      console.log(`From: ${opts.from}`);
      console.log(`To: ${opts.to}`);
      console.log(`Subject: ${opts.subject}`);
      console.log('-----------------------------------');
      console.log('HTML Content Preview:');
      console.log(opts.html ? opts.html.substring(0, 500) + '...' : 'No HTML content');
      console.log('========== END EMAIL LOG ==========\n');
      return Promise.resolve();
    }
  };
}

async function sendMail({ to, subject, text, html, from }) {
  // Use provided from, or fall back to env config, or use SMTP user
  let fromAddress;
  
  if (from) {
    // Direct from parameter takes precedence
    fromAddress = from;
  } else if (FROM_NAME && FROM_EMAIL) {
    // Use app-configured HR/sender email with display name
    fromAddress = `"${FROM_NAME}" <${FROM_EMAIL}>`;
  } else if (FROM_EMAIL) {
    // Just use the email
    fromAddress = FROM_EMAIL;
  } else if (SMTP_USER) {
    // Fallback to SMTP user
    fromAddress = SMTP_USER;
  } else {
    // Last resort
    fromAddress = 'sarthakbomble250@gmail.com';
  }

  try {
    await transporter.sendMail({ from: fromAddress, to, subject, text, html });
    console.log(`✉️  Email sent from: ${fromAddress} to: ${to}`);
  } catch (err) {
    console.error('Error sending mail:', err);
    throw err;
  }
}

module.exports = { sendMail };
