// pages/api/send-email.ts (or app/api/send-email/route.ts if using App Router)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Message</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f7f9fc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 40px 30px; }
            .field { margin-bottom: 25px; }
            .field-label { font-weight: 600; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            .field-value { background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; font-size: 16px; line-height: 1.6; }
            .message-field .field-value { min-height: 100px; white-space: pre-wrap; }
            .footer { background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
            .timestamp { color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Message</h1>
              <p>You've received a new message from your portfolio website</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="field-label">👤 From</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">📧 Email</div>
                <div class="field-value">${email}</div>
              </div>
              
              <div class="field">
                <div class="field-label">📝 Subject</div>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="field message-field">
                <div class="field-label">💬 Message</div>
                <div class="field-value">${message}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>This message was sent from your portfolio contact form</p>
              <p class="timestamp">Received on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Gmail SMTP
    await sendGmailSMTP({
      to: process.env.SMTP_TO!,
      subject: `Portfolio Contact: ${subject}`,
      html: htmlTemplate,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}

async function sendGmailSMTP({ to, subject, html }: { to: string; subject: string; html: string }) {
  const smtpConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  };

  // Using fetch with Gmail SMTP API endpoint
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: 'gmail',
      template_id: 'contact_form',
      user_id: process.env.SMTP_USER,
      template_params: {
        to_email: to,
        subject: subject,
        html_content: html,
      }
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}