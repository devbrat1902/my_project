const nodemailer = require('nodemailer');
const axios = require('axios');

// Email Transporter
const getTransporter = () => {
  if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD }
  });
};

// Send Admin Email
const sendAdminEmail = async (subject, htmlContent) => {
  const transporter = getTransporter();
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: process.env.SMTP_USERNAME,
      subject: `[Just For Kidz] ${subject}`,
      html: htmlContent
    });
    return true;
  } catch (error) {
    console.error('Email failed:', error);
    return false;
  }
};

// Send Confirmation Email to User
const sendUserConfirmationEmail = async (toEmail, name) => {
  const transporter = getTransporter();
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: toEmail,
      subject: 'Thank you for your inquiry - Just For Kidz',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2563EB; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You!</h1>
          </div>
          <div style="padding: 24px;">
            <p>Hi ${name || 'there'},</p>
            <p>We have received your inquiry. Thank you for reaching out to Just For Kidz!</p>
            <p>Our team sees this immediately, and we will get back to you within 24 hours to answer your questions or schedule your visit.</p>
            <p>Best regards,<br>The Just For Kidz Team</p>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
            &copy; ${new Date().getFullYear()} Just For Kidz. All rights reserved.
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('User email failed:', error);
    return false;
  }
};

// Send WhatsApp to Owner
const sendWhatsAppToOwner = async (message) => {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apiKey || apiKey === 'REPLACE_WITH_YOUR_KEY') return false;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
    await axios.get(url);
    return true;
  } catch (error) {
    console.error('WhatsApp failed:', error.message);
    return false;
  }
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { name, email, phone, company, service, message } = req.body;

    if (!name || !email || !phone || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailHtml = `
      <h2>New Contact Form Inquiry</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Child Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${company}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Program:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${service}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${message || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
      </table>
    `;

    const emailSent = await sendAdminEmail('New Contact Inquiry', emailHtml);
    const userEmailSent = await sendUserConfirmationEmail(email, name);

    const waMessage = `📬 New *Contact Inquiry*!\n\n👤 Name: ${name}\n📧 Email: ${email}\n☎️ Phone: ${phone}\n🏫 Program: ${service}\n💬 Message: ${message || 'N/A'}`;
    sendWhatsAppToOwner(waMessage);

    return res.status(200).json({
      message: 'Inquiry received successfully',
      adminEmailSent: emailSent,
      userEmailSent: userEmailSent
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
