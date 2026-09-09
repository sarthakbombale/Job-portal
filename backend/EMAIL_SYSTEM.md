# Email Notification System for Job Portal

## Overview
The Job Portal now includes a professional email notification system that sends beautifully formatted HTML emails to candidates when their application status is updated. Emails are branded as coming from your HR team with your company name prominently displayed.

## Features

### 1. **Professional Email Templates**
- **Accepted Status**: Congratulations message with next steps for interview preparation
- **Rejected Status**: Thank you message with suggestions for future applications
- **Pending Status**: Under review message explaining the timeline

### 2. **HR Branding**
- Emails show "Human Resources" badge in header
- Displays company name prominently
- Shows which department sent the email
- Professional HR contact information in footer
- Messages mention "HR Team" throughout

### 3. **Email Design**
- Responsive HTML/CSS design that works on all devices
- Modern gradient header with purple theme
- Color-coded status indicators (green for accepted, red for rejected, orange for pending)
- Clear call-to-action buttons
- Professionally formatted with proper spacing

### 4. **Email Content**
Each email includes:
- Candidate's name
- Company name with HR branding
- Job position applied for
- Application timeline (applied date & status updated date)
- Custom message from HR recruiter (optional)
- Next steps relevant to the application status
- Action buttons (View Dashboard for accepted, View More Jobs for rejected)
- HR support contact information

## Quick Start

### Step 1: Setup Environment Variables

Copy the example file:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your email details:
```env
# Your email to send FROM
SMTP_USER=sarthakbomble250@gmail.com
SMTP_PASS=your-app-password

# Who the email appears to come FROM (HR branding)
FROM_EMAIL=sarthakbomble250@gmail.com
FROM_NAME=HR Team

# Where links in emails will point
FRONTEND_URL=http://localhost:5173

# Support email shown in footer
SUPPORT_EMAIL=sarthakbomble250@gmail.com
```

### Step 2: For Gmail Users - Get App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Google generates a 16-character password
4. Put this in `SMTP_PASS` in your `.env`

### Step 3: Test It

Update an application status from the admin panel. Email will be sent from your configured address with HR branding.

## Files Added/Modified

### New Files:
1. **`backend/.env.example`**
   - Configuration template for email setup
   - Shows all required environment variables

2. **`backend/utils/emailTemplate.js`**
   - Email template generation with HR branding
   - Status-specific templates (accepted/rejected/pending)
   - Professional HTML rendering

### Modified Files:
1. **`backend/utils/mailer.js`**
   - Added `FROM_NAME` support for HR display names
   - Improved "from" address formatting
   - Better logging and error handling
   - Format: `"HR Team" <your-email@example.com>`

2. **`backend/controllers/applicationController.js`**
   - Uses new HR-branded email templates
   - Integrated professional email content
   - Improved subject lines

## How It Works

### Email Sending Flow:

1. **Admin updates status** in applicants page
2. **Backend processes update**:
   - Saves new status to database
   - Generates professional HTML email
   - Includes HR branding and company info
3. **Email is sent FROM**:
   - Display Name: `HR Team` (from `FROM_NAME`)
   - Email Address: `sarthakbomble250@gmail.com` (from `FROM_EMAIL`)
4. **Candidate receives** professional branded email with:
   - Company name and HR badge
   - Status update with next steps
   - Action button
   - HR contact info

### Email Example - Accepted Status:

```
FROM: "HR Team" <sarthakbomble250@gmail.com>
TO: candidate@example.com
SUBJECT: Great news! You're selected for Senior Developer

CONTENT:
┌─────────────────────────────────────┐
│   [Company Logo/Name]               │
│   Application Status Update         │
│   🏢 Human Resources                │
└─────────────────────────────────────┘

Hello Sarthak,

Message from HR Team
This update is sent from [Company Name] Human Resources

🎉 ACCEPTED
Congratulations! Your application has been accepted!
We are excited to move forward with your application. Our HR team 
will contact you shortly with next steps.

APPLICATION DETAILS
Position: Senior Developer
Company: Your Company
Applied On: September 8, 2026
Status Updated: September 9, 2026

[Personal message from HR if provided]

NEXT STEPS
✓ Review the job description
✓ Prepare for your interview
✓ Check your email for interview details
✓ Reach out if you have any questions

[View Dashboard Button]

FOOTER:
Thank you for your interest in Your Company!

💬 Need Help?
Our HR team is here to help. Reply to this email or contact us at 
sarthakbomble250@gmail.com
```

## Configuration Reference

### Required Environment Variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `SMTP_HOST` | Email server | `smtp.gmail.com` |
| `SMTP_PORT` | Server port | `587` |
| `SMTP_USER` | Email login | `sarthakbomble250@gmail.com` |
| `SMTP_PASS` | Email password | `xxxx xxxx xxxx xxxx` |
| `FROM_EMAIL` | Sender email | `sarthakbomble250@gmail.com` |
| `FROM_NAME` | **HR Display Name** | `HR Team` |

### Optional Variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `FRONTEND_URL` | Links in emails | `http://localhost:5173` |
| `SUPPORT_EMAIL` | Footer contact | `support@jobportal.com` |

## Email Template Customization

### Change Next Steps:

Edit `backend/utils/emailTemplate.js`:

```javascript
const statusConfig = {
  accepted: {
    statusMessage: '🎉 Congratulations!...',
    statusDescription: 'Custom description...',
    nextStepsTitle: 'What Happens Next',
    nextSteps: [
      'Custom step 1',
      'Custom step 2',
      'Custom step 3'
    ],
    // ...
  }
};
```

### Change Company Name or HR Team Name:

The company name is pulled from the Job document. The HR name comes from `FROM_NAME` env variable. To change HR branding globally:

```env
FROM_NAME=Recruitment Team
# or
FROM_NAME=People Operations
# or
FROM_NAME=Talent Acquisition
```

## Testing

### Development Mode (Console Output):
```bash
# Run backend without SMTP configured
npm run dev
# Emails will print to console instead of sending
```

Console output shows:
```
📧 ========== MAILER FALLBACK (Console Log) ==========
From: "HR Team" <sarthakbomble250@gmail.com>
To: candidate@example.com
Subject: Great news! You're selected for...
-----------------------------------
HTML Content Preview:
<!DOCTYPE html>...
========== END EMAIL LOG ==========
```

### Production Mode (Real Email):
```bash
# With SMTP configured in .env
npm run dev
# Update application status
# Check candidate's inbox
```

Console output shows:
```
✉️  Email sent from: "HR Team" <sarthakbomble250@gmail.com> to: candidate@example.com
```

## Gmail Setup (Step by Step)

### 1. Enable 2-Step Verification
- Go to https://myaccount.google.com/security
- Enable "2-Step Verification"

### 2. Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" as the app
- Select your device type
- Google generates a 16-character password
- Copy and paste to `.env` as `SMTP_PASS`

### 3. Update .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sarthakbomble250@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Paste 16-char app password
FROM_EMAIL=sarthakbomble250@gmail.com
FROM_NAME=HR Team
```

### 4. Test
Update an application status and check for the email.

## Troubleshooting

### "Invalid Login" Error
- Verify SMTP_USER and SMTP_PASS
- Use Gmail App Password (not account password)
- Check 2-Step Verification is enabled

### Email Not Received
1. Check console for error messages
2. Verify candidate email exists in database
3. Check spam folder
4. Test with your own email first

### Email Looks Wrong
- Clear email client cache
- Try different email app (Gmail, Outlook, Apple Mail)
- Verify CSS renders properly

### FROM Address Shows Wrong Name
- Check `FROM_NAME` in `.env`
- Update to desired HR name
- Restart backend server
- Test again

## Best Practices

1. ✅ Use Gmail App Password (not regular password)
2. ✅ Keep .env file in .gitignore (never commit secrets)
3. ✅ Test with personal email first before going live
4. ✅ Use professional FROM_NAME (e.g., "HR Team")
5. ✅ Monitor email delivery in console logs
6. ✅ Update FRONTEND_URL for production links
7. ✅ Use HTTPS_FRONTEND_URL for production

## Production Deployment

### For Heroku:
```bash
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=sarthakbomble250@gmail.com
heroku config:set SMTP_PASS=xxxx xxxx xxxx xxxx
heroku config:set FROM_EMAIL=sarthakbomble250@gmail.com
heroku config:set FROM_NAME="HR Team"
heroku config:set FRONTEND_URL=https://yourdomain.com
```

### Consider Using Email Service:
- SendGrid
- Mailgun
- AWS SES
- Postmark

These services handle delivery, tracking, and bounce management.

## Email Templates Included

### 1. Accepted Status
- Congratulations message
- Interview preparation steps
- Dashboard link
- HR contact

### 2. Rejected Status
- Thank you message
- Encouragement for future
- Other jobs link
- HR contact

### 3. Pending Status
- Under review message
- Timeline expectation (5-7 days)
- HR contact

## API Endpoint

### Update Application Status
```
PUT /api/applications/:appId/status

Body:
{
  "status": "accepted|rejected|pending",
  "message": "Optional personal message from HR"
}

Response:
{
  "msg": "Status updated",
  "app": { ... }
}
```

When status is updated, email is automatically sent to candidate.

## Files Structure

```
backend/
├── .env                      # Your sensitive config
├── .env.example             # Template for .env
├── utils/
│   ├── mailer.js            # Email sender (updated)
│   └── emailTemplate.js     # Email templates (updated)
├── controllers/
│   └── applicationController.js  # Status update logic (updated)
└── EMAIL_SYSTEM.md          # This file
```

## Support

For issues or help:
1. Check console logs for error messages
2. Verify all `.env` variables are set correctly
3. Test Gmail login at https://myaccount.google.com
4. Review email files:
   - `backend/utils/mailer.js` - Email sending logic
   - `backend/utils/emailTemplate.js` - Template rendering
   - `backend/controllers/applicationController.js` - Status update

## Next Steps

1. ✅ Copy `.env.example` to `.env`
2. ✅ Add your email details to `.env`
3. ✅ Get Gmail App Password if needed
4. ✅ Restart backend server
5. ✅ Test by updating application status
6. ✅ Check candidate's inbox
