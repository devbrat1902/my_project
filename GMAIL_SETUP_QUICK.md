# Quick Gmail SMTP Setup Guide

## ⚡ Quick Steps (5 minutes)

### Step 1: Create Gmail App Password

1. **Open this link**: https://myaccount.google.com/apppasswords
   - Sign in with: `devbrat1office@gmail.com`

2. **If you see "App passwords"**:
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other" → Type "Lead Capture"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

3. **If you DON'T see "App passwords"**:
   - First enable 2-Step Verification:
     - Go to: https://myaccount.google.com/security
     - Click "2-Step Verification" → Follow setup
   - Then go back to: https://myaccount.google.com/apppasswords

### Step 2: Update .env File

1. Open `.env` file in your project
2. Find this line:
   ```
   SMTP_PASSWORD=your_gmail_app_password_here
   ```
3. Replace `your_gmail_app_password_here` with your app password
4. **Remove spaces** from the password (use: `abcdefghijklmnop`)
5. Save the file

**Example:**
```env
SMTP_USERNAME=devbrat1office@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
```

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
python app.py
```

### Step 4: Test It!

1. Open http://localhost:8000
2. Fill and submit the form
3. Check `devbrat1office@gmail.com` inbox
4. You should receive a beautiful HTML email! 📧

---

## ✅ What You'll See

**In Server Logs:**
```
Email notification prepared for: devbrat1office@gmail.com
Email sent successfully!
```

**In Gmail Inbox:**
- Subject: "New Lead Submission - [email]"
- Beautiful HTML email with all lead details
- Professional formatting with icons

---

## 🔧 Troubleshooting

**"Authentication failed"**
- Make sure you're using the **App Password**, not your regular password
- Remove any spaces from the app password
- Verify 2-Step Verification is enabled

**"No module named 'smtplib'"**
- This is built into Python, should not happen
- Try restarting Python

**Email not received**
- Check spam/junk folder
- Verify email address is correct in app.py
- Check server logs for errors

---

## 🎉 Done!

Once configured, every lead submission will automatically send an email to `devbrat1office@gmail.com` with all the details!
