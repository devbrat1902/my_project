const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials!');
  console.error('Please create a .env file with:');
  console.error('SUPABASE_URL=your_project_url');
  console.error('SUPABASE_SERVICE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

// Helper function to send email to Admin
const sendAdminEmail = async (subject, htmlContent) => {
  if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === 'your_gmail_app_password_here') {
    console.warn('⚠️  Email not sent: SMTP credentials missing or default.');
    return false;
  }

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: process.env.SMTP_USERNAME, // Send to self (admin)
    subject: `[Just For Kidz] ${subject}`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Admin email sent successfully!');
    return true;
  } catch (error) {
    console.error('❌ Admin email sending failed:', error);
    return false;
  }
};

// Helper function to send confirmation email to User
const sendUserConfirmationEmail = async (toEmail, name) => {
  if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) return false;

  const mailOptions = {
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
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 User confirmation email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ User confirmation email failed:', error);
    return false;
  }
};

// Helper function to send WhatsApp to Owner (CallMeBot)
const sendWhatsAppToOwner = async (message) => {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey || apiKey === 'REPLACE_WITH_YOUR_KEY') {
    console.warn('⚠️  WhatsApp not sent: Credentials missing or placeholder in .env');
    return false;
  }

  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

    // CallMeBot uses GET request
    await axios.get(url);
    console.log('📱 WhatsApp notification sent to owner!');
    return true;
  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error.message);
    return false;
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from project root

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// GET handler for /api/lead (browser visits)
app.get('/api/lead', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Lead API is active. Use POST to submit a lead.',
    endpoints: {
      'POST /api/lead': 'Submit a new lead (requires phone field)',
      'POST /api/contact': 'Submit a contact inquiry',
      'GET /api/health': 'Health check'
    }
  });
});

// API Route for Lead Capture with Supabase
app.post('/api/lead', async (req, res) => {
  try {
    const { email, phone, pageUrl, referrer, userAgent, timezone } = req.body;

    // Validation - only phone is required now
    if (!phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Phone number is required'
      });
    }

    // Prepare data for Supabase
    const leadData = {
      email: (email && email.trim()) ? email.toLowerCase().trim() : null,
      phone: phone.trim(),
      page_url: pageUrl || '',
      referrer: referrer || '',
      user_agent: userAgent || '',
      timezone: timezone || '',
      status: 'new'
    };

    console.log('--- New Lead Submission ---');
    console.log('Email:', leadData.email || 'N/A');
    console.log('Phone:', leadData.phone);
    console.log('Page URL:', leadData.page_url);
    console.log('Timezone:', leadData.timezone);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('❌ Supabase Error:', error);

      // Handle unique constraint violation (duplicate email)
      // Return success to user (don't reveal if email exists - prevents enumeration)
      if (error.code === '23505') {
        console.log('⚠️  Duplicate email detected - returning success without saving');
        return res.status(200).json({
          message: 'Lead captured successfully',
          leadId: 'duplicate-not-saved'
        });
      }

      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to save lead. Please try again.'
      });
    }

    console.log('✅ Lead saved successfully!');
    console.log('Lead ID:', data[0].id);

    // Send email notification for Lead Capture to Admin
    const emailHtml = `
      <h2>New Lead Capture Submission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leadData.phone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Page:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${leadData.page_url}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
      </table>
    `;
    sendAdminEmail('New Lead Captured', emailHtml);

    // Send WhatsApp to Owner
    const waMessage = `🔔 New *Lead Capture*!\n\n☎️ Phone: ${leadData.phone}\n🔗 Page: ${leadData.page_url}\n⏰ Time: ${new Date().toLocaleTimeString()}`;
    sendWhatsAppToOwner(waMessage);

    console.log('---------------------------');

    // Success response
    res.status(200).json({
      message: 'Lead captured successfully',
      leadId: data[0].id
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred'
    });
  }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format data for email
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

    // Send email to Admin
    const emailSent = await sendAdminEmail('New Contact Inquiry', emailHtml);

    // Send Confirmation to User
    console.log(`🚀 DEBUG: Attempting to send confirmation to user email: [${email}]`);
    const userEmailSent = await sendUserConfirmationEmail(email, name);

    // Send WhatsApp to Owner
    const waMessage = `📬 New *Contact Inquiry*!\n\n👤 Name: ${name}\n📧 Email: ${email}\n☎️ Phone: ${phone}\n🏫 Program: ${service}\n💬 Message: ${message || 'N/A'}`;
    sendWhatsAppToOwner(waMessage);

    // Optional: Save to Supabase (reusing leads table for simplicity or create a new 'inquiries' table)
    // For now, we will just save basic info to leads if we want, but let's just stick to email as requested.

    res.status(200).json({
      message: 'Inquiry received successfully',
      adminEmailSent: emailSent,
      userEmailSent: userEmailSent
    });

  } catch (error) {
    console.error('❌ Contact API Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📍 Running at: http://localhost:${PORT}`);
  console.log(`📊 Lead API: http://localhost:${PORT}/api/lead`);
  console.log(`💾 Database: Connected to Supabase`);
  console.log('-----------------------------------');
});
