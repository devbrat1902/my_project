# Gmail SMTP Setup for Email Notifications

## Overview
The lead capture system now sends email notifications to `devbrat1office@gmail.com` whenever a new lead is submitted.

---

## Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", enable **2-Step Verification** (if not already enabled)
4. After enabling 2-Step Verification, go back to **Security**
5. Click on **App passwords** (under "How you sign in to Google")
6. Select:
   - **App**: Mail
   - **Device**: Other (Custom name) - enter "Just For Kidz Lead Capture"
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this)

---

## Step 2: Update .env File

Add these lines to your `.env` file:

```env
# Email Configuration
SMTP_USERNAME=devbrat1office@gmail.com
SMTP_PASSWORD=your_16_character_app_password_here
```

Replace `your_16_character_app_password_here` with the app password you generated.

---

## Step 3: Enable Email Sending in app.py

Open `app.py` and find the `send_email_notification` function (around line 100).

**Uncomment these lines:**

```python
# Uncomment below when SMTP is configured:
smtp_server = "smtp.gmail.com"
smtp_port = 587
smtp_username = os.getenv('SMTP_USERNAME')  # Your Gmail address
smtp_password = os.getenv('SMTP_PASSWORD')  # Gmail app password

with smtplib.SMTP(smtp_server, smtp_port) as server:
    server.starttls()
    server.login(smtp_username, smtp_password)
    server.send_message(msg)
```

**Remove the `#` at the beginning of each line.**

---

## Step 4: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
python app.py
```

---

## Step 5: Test Email Notification

1. Open http://localhost:8000
2. Fill in the lead capture form
3. Submit the form
4. Check `devbrat1office@gmail.com` inbox
5. You should receive a beautifully formatted email with all lead details!

---

## Email Format

The email will include:

- **Subject**: "New Lead Submission - [email address]"
- **From**: Just For Kidz Lead Capture
- **To**: devbrat1office@gmail.com

**Email Body** (HTML formatted):
- 📧 Email Address
- 📱 Phone Number (with country code)
- 🌐 Page URL
- 🔗 Referrer
- 🕐 Timezone
- 💻 User Agent
- 📅 Submission Time

---

## Troubleshooting

### "Authentication failed" error
- Make sure you're using the **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check that SMTP_USERNAME and SMTP_PASSWORD are correctly set in `.env`

### "Connection refused" error
- Check your internet connection
- Verify port 587 is not blocked by firewall

### Email not received
- Check spam/junk folder
- Verify the email address in `app.py` is correct: `devbrat1office@gmail.com`
- Check server logs for error messages

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file to Git
- Keep your app password secure
- The app password only works for this specific application
- You can revoke it anytime from Google Account settings

---

## Alternative: Using SendGrid (Optional)

If Gmail SMTP doesn't work, you can use SendGrid:

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Get API key
3. Update `app.py` to use SendGrid API instead of SMTP

---

**You're all set!** Every lead submission will now send an email to devbrat1office@gmail.com 📧
