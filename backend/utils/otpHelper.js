/**
 * OTP Utility Functions
 * Handles OTP generation, validation, and email sending
 */

const { sendMail } = require('./mailer');

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry time (10 minutes from now)
 * @returns {Date} Expiry date/time
 */
function getOTPExpiry() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10); // OTP valid for 10 minutes
  return now;
}

/**
 * Check if OTP has expired
 * @param {Date} otpExpiry - OTP expiry timestamp
 * @returns {boolean} True if OTP is expired
 */
function isOTPExpired(otpExpiry) {
  if (!otpExpiry) return true;
  return new Date() > new Date(otpExpiry);
}

/**
 * Send OTP via email
 * @param {string} email - User's email
 * @param {string} otp - OTP to send
 * @param {string} userName - User's name
 * @returns {Promise}
 */
async function sendOTPEmail(email, otp, userName = 'User') {
  try {
    const subject = '🔐 Your Login OTP - Job Portal';
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 500px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        }

        .greeting strong {
            color: #667eea;
        }

        .message {
            background-color: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #555;
            line-height: 1.6;
        }

        .otp-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
        }

        .otp-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            color: #10b981;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }

        .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
        }

        .otp-validity {
            font-size: 12px;
            color: #f59e0b;
            margin-top: 10px;
            font-weight: 600;
        }

        .warning {
            background-color: #fef2f2;
            border: 1px solid #fee2e2;
            border-radius: 4px;
            padding: 12px;
            margin: 20px 0;
            font-size: 13px;
            color: #991b1b;
        }

        .warning strong {
            display: block;
            margin-bottom: 5px;
        }

        .instructions {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            font-size: 13px;
        }

        .instructions h3 {
            color: #667eea;
            font-size: 13px;
            text-transform: uppercase;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .instructions ol {
            padding-left: 20px;
        }

        .instructions li {
            margin: 8px 0;
            color: #555;
        }

        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }

        .footer p {
            font-size: 12px;
            color: #999;
            margin: 5px 0;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 15px 0;
        }

        @media (max-width: 500px) {
            .container {
                margin: 10px;
            }

            .content {
                padding: 20px;
            }

            .otp-code {
                font-size: 24px;
                letter-spacing: 2px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Login Verification</h1>
            <p>One-Time Password (OTP)</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello <strong>${userName}</strong>,
            </div>

            <div class="message">
                You've initiated a login request to your Job Portal account. Use the OTP below to complete your login process. This code is valid for <strong>10 minutes</strong> only.
            </div>

            <div class="otp-box">
                <div class="otp-label">Your OTP Code</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-validity">⏱️ Valid for 10 minutes</div>
            </div>

            <div class="instructions">
                <h3>How to Use Your OTP:</h3>
                <ol>
                    <li>Copy the 6-digit code above</li>
                    <li>Return to the login page</li>
                    <li>Enter the OTP in the verification field</li>
                    <li>Click "Verify OTP" to complete login</li>
                </ol>
            </div>

            <div class="warning">
                <strong>Security Notice:</strong>
                <div>Never share this OTP with anyone. Job Portal staff will never ask for your OTP.</div>
            </div>

            <div class="message">
                <strong>Didn't request this?</strong><br>
                If you didn't attempt to login, you can safely ignore this email. Your account is secure.
            </div>
        </div>

        <div class="footer">
            <p>This is an automated email from Job Portal. Please do not reply to this address.</p>
            <div class="divider"></div>
            <p>© 2026 Job Portal. All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 11px; color: #bbb;">
                For security reasons, this OTP will expire in 10 minutes.
            </p>
        </div>
    </div>
</body>
</html>`;

    const text = `Your OTP for Job Portal login is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nRegards,\nJob Portal Team`;

    await sendMail({ to: email, subject, html, text });
    console.log(`✉️  OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}

/**
 * Verify OTP
 * @param {string} providedOTP - OTP provided by user
 * @param {string} storedOTP - OTP stored in database
 * @param {Date} otpExpiry - OTP expiry time
 * @returns {Object} { isValid: boolean, message: string }
 */
function verifyOTP(providedOTP, storedOTP, otpExpiry) {
  if (!storedOTP) {
    return { isValid: false, message: 'No OTP found. Request a new OTP.' };
  }

  if (isOTPExpired(otpExpiry)) {
    return { isValid: false, message: 'OTP has expired. Request a new OTP.' };
  }

  if (providedOTP.trim() !== storedOTP.trim()) {
    return { isValid: false, message: 'Invalid OTP. Please try again.' };
  }

  return { isValid: true, message: 'OTP verified successfully!' };
}

module.exports = {
  generateOTP,
  getOTPExpiry,
  isOTPExpired,
  sendOTPEmail,
  verifyOTP
};
