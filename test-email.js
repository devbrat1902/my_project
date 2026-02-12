require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('1. Loading credentials...');
  const user = process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;

  console.log('   User:', user);
  console.log('   Pass:', pass ? '******' + pass.slice(-4) : 'MISSING');

  if (!user || !pass) {
    console.error('❌ Missing credentials in .env file');
    return;
  }

  console.log('2. Creating transporter...');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });

  console.log('3. Sending test email...');
  try {
    const info = await transporter.sendMail({
      from: user,
      to: user, // Send to self
      subject: 'Test Email from Just For Kidz Debugger',
      text: 'If you see this, the email configuration is working!'
    });
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error(error);
  }
}

testEmail();
