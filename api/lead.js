const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Email Transporter
const getTransporter = () => {
  if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === 'your_gmail_app_password_here') return null;
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Lead API is active. Use POST to submit a lead.',
      endpoints: {
        'POST /api/lead': 'Submit a new lead (requires phone field)',
        'POST /api/contact': 'Submit a contact inquiry',
        'GET /api/health': 'Health check'
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const { email, phone, pageUrl, referrer, userAgent, timezone } = req.body;

      if (!phone) {
        return res.status(400).json({ error: 'Missing required fields', message: 'Phone number is required' });
      }

      if (!supabase) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      const leadData = {
        email: (email && email.trim()) ? email.toLowerCase().trim() : null,
        phone: phone.trim(),
        page_url: pageUrl || '',
        referrer: referrer || '',
        user_agent: userAgent || '',
        timezone: timezone || '',
        status: 'new'
      };

      const { data, error } = await supabase.from('leads').insert([leadData]).select();

      if (error) {
        if (error.code === '23505') {
          return res.status(200).json({ message: 'Lead captured successfully', leadId: 'duplicate-not-saved' });
        }
        return res.status(500).json({ error: 'Database error', message: 'Failed to save lead. Please try again.' });
      }

      // Send notifications (non-blocking)
      const emailHtml = `
        <h2>New Lead Capture Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leadData.phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Page:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leadData.page_url}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
        </table>
      `;
      sendAdminEmail('New Lead Captured', emailHtml);

      const waMessage = `🔔 New *Lead Capture*!\n\n☎️ Phone: ${leadData.phone}\n🔗 Page: ${leadData.page_url}\n⏰ Time: ${new Date().toLocaleTimeString()}`;
      sendWhatsAppToOwner(waMessage);

      return res.status(200).json({ message: 'Lead captured successfully', leadId: data[0].id });

    } catch (error) {
      console.error('Server Error:', error);
      return res.status(500).json({ error: 'Server error', message: 'An unexpected error occurred' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
