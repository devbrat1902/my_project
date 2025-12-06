const axios = require('axios');
require('dotenv').config();

const sendWhatsAppTest = async () => {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  console.log('--- WhatsApp Configuration Check ---');
  console.log(`Phone Configured: ${phone ? 'YES' : 'NO'} (${phone})`);
  console.log(`API Key Configured: ${apiKey ? 'YES' : 'NO'}`);

  if (!phone || !apiKey) {
    console.error('❌ ERROR: Credentials totally missing in .env');
    return;
  }

  if (apiKey === 'REPLACE_WITH_YOUR_KEY') {
    console.warn('⚠️  WARNING: Using placeholder Key. The message will likely fail, but we will try...');
  }

  const message = 'Test message from Just For Kidz Server!';

  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

    console.log(`🚀 Sending test request to: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

    await axios.get(url);
    console.log('✅ SUCCESS: WhatsApp message sent! Check your phone.');
  } catch (error) {
    console.error('❌ FAILED: Could not send WhatsApp message.');
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${error.response.data}`);
    }
  }
};

sendWhatsAppTest();
