const fs = require('fs');
const path = require('path');

/**
 * Email template content with placeholders
 */
const getEmailTemplate = (status) => {
  const statusConfig = {
    accepted: {
      statusMessage: '🎉 Congratulations! Your application has been accepted!',
      statusDescription: 'We are excited to move forward with your application. Our HR team will contact you shortly with next steps.',
      nextStepsTitle: 'Next Steps',
      nextSteps: [
        'Review the job description',
        'Prepare for your interview',
        'Check your email for interview details',
        'Reach out if you have any questions'
      ],
      buttonText: 'View Dashboard',
      buttonUrl: 'dashboardUrl'
    },
    rejected: {
      statusMessage: 'Thank you for your interest',
      statusDescription: 'After careful review of your application, we have decided to move forward with other candidates. We appreciate your interest in our company and encourage you to apply for future positions.',
      nextStepsTitle: 'We Encourage You To',
      nextSteps: [
        'Explore other open positions that match your profile',
        'Enhance your skills and experience',
        'Apply again for future openings',
        'Connect with us on social media for updates'
      ],
      buttonText: 'View More Jobs',
      buttonUrl: 'jobsUrl'
    },
    pending: {
      statusMessage: '⏳ Your application is under review',
      statusDescription: 'Thank you for applying! Our HR team is currently reviewing your application. We will update you as soon as we have a decision.',
      nextStepsTitle: 'What to Expect',
      nextSteps: [
        'Our HR team is reviewing your profile',
        'You will receive an update within 5-7 business days',
        'Watch your email for any communications',
        'Feel free to explore other opportunities'
      ],
      buttonText: null,
      buttonUrl: null
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const nextStepsHtml = config.nextSteps.map(step => `<li>${step}</li>`).join('');

  return (data) => {
    const button = config.buttonText && data[config.buttonUrl] 
      ? `<a href="${data[config.buttonUrl]}" class="btn btn-primary">${config.buttonText}</a>` 
      : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update - ${data.companyName}</title>
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
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .header-company {
            font-size: 14px;
            opacity: 0.95;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .hr-badge {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 16px;
            margin-bottom: 25px;
            color: #333;
        }

        .greeting strong {
            color: #667eea;
        }

        .from-info {
            background-color: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 12px 15px;
            margin-bottom: 25px;
            border-radius: 4px;
            font-size: 13px;
            color: #555;
        }

        .from-info strong {
            color: #667eea;
        }

        .status-card {
            background-color: #f9f9f9;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            border-left: 5px solid #667eea;
        }

        .status-card.accepted {
            border-left-color: #10b981;
            background: linear-gradient(135deg, #f0fdf4 0%, #f0fdf4 100%);
        }

        .status-card.rejected {
            border-left-color: #ef4444;
            background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
        }

        .status-card.pending {
            border-left-color: #f59e0b;
            background: linear-gradient(135deg, #fffbf0 0%, #fffbf0 100%);
        }

        .status-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            display: inline-block;
            padding: 6px 12px;
            border-radius: 4px;
        }

        .status-label.accepted {
            color: #10b981;
            background-color: #d1fae5;
        }

        .status-label.rejected {
            color: #ef4444;
            background-color: #fee2e2;
        }

        .status-label.pending {
            color: #f59e0b;
            background-color: #fef3c7;
        }

        .status-title {
            font-size: 22px;
            font-weight: 600;
            margin: 12px 0 8px 0;
            color: #1f2937;
        }

        .job-details {
            background-color: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }

        .job-details h3 {
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            font-weight: 600;
            color: #666;
            font-size: 14px;
        }

        .detail-value {
            color: #333;
            font-size: 14px;
            text-align: right;
        }

        .message-section {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .message-section p {
            font-size: 14px;
            line-height: 1.6;
            color: #555;
        }

        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }

        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 0 10px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .btn-primary {
            background-color: #667eea;
            color: white;
        }

        .next-steps {
            background-color: #f0f4ff;
            border: 1px solid #dde2f1;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
        }

        .next-steps h4 {
            color: #667eea;
            font-size: 14px;
            margin-bottom: 12px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }

        .next-steps li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            font-size: 14px;
            color: #555;
        }

        .next-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }

        .next-steps.rejected li:before {
            content: "→";
            color: #667eea;
        }

        .footer {
            background-color: #f5f5f5;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }

        .footer-section {
            margin-bottom: 15px;
        }

        .footer p {
            font-size: 12px;
            color: #999;
            margin: 8px 0;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        .hr-contact {
            background-color: #f0f4ff;
            border: 1px solid #dde2f1;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 15px;
            font-size: 12px;
        }

        .hr-contact strong {
            color: #667eea;
        }

        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 15px 0;
        }

        @media (max-width: 600px) {
            .container {
                margin: 10px;
            }

            .content {
                padding: 20px 15px;
            }

            .header {
                padding: 30px 15px;
            }

            .header h1 {
                font-size: 22px;
            }

            .detail-row {
                flex-direction: column;
            }

            .detail-label {
                margin-bottom: 5px;
            }

            .detail-value {
                text-align: left;
            }

            .btn {
                display: block;
                width: 100%;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header with HR Branding -->
        <div class="header">
            <div class="header-company">${data.companyName}</div>
            <h1>Application Status Update</h1>
            <p>Your job application has been reviewed</p>
            <div class="hr-badge">Human Resources</div>
        </div>

        <div class="content">
            <div class="greeting">
                Hello <strong>${data.candidateName}</strong>,
            </div>

            <!-- From HR Info -->
            <div class="from-info">
                <strong>📧 Message from HR Team</strong><br>
                This update is sent from ${data.companyName} Human Resources
            </div>

            <!-- Status Card -->
            <div class="status-card ${status}">
                <div class="status-label ${status}">${data.statusDisplay}</div>
                <div class="status-title">${config.statusMessage}</div>
                <p style="color: #666; font-size: 14px; margin-top: 8px;">${config.statusDescription}</p>
            </div>

            <!-- Job Details -->
            <div class="job-details">
                <h3>Application Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Position</span>
                    <span class="detail-value"><strong>${data.jobTitle}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Company</span>
                    <span class="detail-value"><strong>${data.companyName}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Applied On</span>
                    <span class="detail-value">${data.appliedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status Updated</span>
                    <span class="detail-value">${data.updatedDate}</span>
                </div>
            </div>

            <!-- Custom Message from HR -->
            ${data.customMessage ? `<div class="message-section">
                <p><strong>💬 Personal Message from HR:</strong></p>
                <p style="margin-top: 10px;">${data.customMessage}</p>
            </div>` : ''}

            <!-- Next Steps -->
            <div class="next-steps ${status}">
                <h4>${config.nextStepsTitle}</h4>
                <ul>
                    ${nextStepsHtml}
                </ul>
            </div>

            <!-- Action Button -->
            ${button ? `<div class="action-buttons">${button}</div>` : ''}
        </div>

        <!-- Footer with HR Contact -->
        <div class="footer">
            <div class="footer-section">
                <p>Thank you for your interest in ${data.companyName}!</p>
            </div>

            <div class="hr-contact">
                <strong>Need Help?</strong><br>
                Our HR team is here to help. Reply to this email or contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
            </div>

            <div class="divider"></div>

            <div class="footer-section">
                <p style="font-size: 11px;">© 2026 ${data.companyName}. All rights reserved.</p>
                <p style="margin-top: 10px; font-size: 11px; color: #bbb;">
                    This is an automated email from our HR department. Please do not reply to the sender address.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`;
    return html;
  };
};

/**
 * Render email template with provided data
 * @param {string} status - Application status (accepted, rejected, pending)
 * @param {Object} data - Data to render in the template
 * @returns {string} Rendered HTML
 */
function renderTemplate(status, data) {
  try {
    const templateFn = getEmailTemplate(status);
    const enrichedData = {
      ...data,
      statusDisplay: data.status || 'Pending'
    };
    return templateFn(enrichedData);
  } catch (error) {
    console.error('Template rendering error:', error);
    throw error;
  }
}

module.exports = { renderTemplate };

