# Testing Supabase Integration

## Quick Test Guide

Your Supabase integration is now complete! Here's how to test it:

### 1. Start the Flask Server

The server is already running on port 8000. You should see:
```
Server started successfully!
Running at: http://localhost:8000
Lead API: http://localhost:8000/api/lead
Database: Connected to Supabase
```

### 2. Test the Lead Capture Form

1. Open your browser to: `http://localhost:8000/index.html`
2. Wait for the modal to appear (1 second delay)
3. Fill in the form:
   - **Email**: test@example.com
   - **Phone**: 9876543210
   - **Consent**: Check the box
4. Click **"Submit"**
5. You should see a success message!

### 3. Verify in Supabase

1. Go to your Supabase dashboard
2. Click **"Table Editor"** in the sidebar
3. Click on the **"leads"** table
4. You should see your test lead with all the data!

### 4. View All Leads (API)

You can also view all leads by visiting:
```
http://localhost:8000/api/leads
```

This will show you all captured leads in JSON format.

---

## What's Been Completed

✅ **Flask Backend** (`app.py`)
- Supabase client initialized
- Lead capture endpoint with validation
- Error handling and CORS support
- View all leads endpoint

✅ **Database Setup**
- Supabase project created
- `leads` table with all required columns
- RLS policy configured
- API credentials configured

✅ **Frontend Integration**
- Lead capture modal with country code dropdown
- Flag images for countries (India, USA, UK, Australia)
- Form validation
- API endpoint updated to Flask server

✅ **Dependencies**
- Python packages installed (Flask, Supabase, etc.)
- `.env` file created with your credentials

---

## Files Created/Modified

### New Files:
- `app.py` - Flask backend with Supabase integration
- `requirements.txt` - Python dependencies
- `.env` - Environment variables (your Supabase credentials)
- `SUPABASE_SETUP.md` - Detailed setup instructions

### Modified Files:
- `lc-script.js` - Updated API endpoint to Flask server
- `lc-styles.css` - Custom dropdown with flag support

---

## Next Steps

### For Production:

1. **Deploy Flask App**
   - Use services like Heroku, Railway, or PythonAnywhere
   - Set environment variables on the hosting platform

2. **Update Frontend API Endpoint**
   - Change `http://localhost:8000/api/lead` to your production URL
   - Example: `https://your-app.herokuapp.com/api/lead`

3. **Add Email Notifications** (Optional)
   - Use SendGrid, Mailgun, or similar
   - Send email when new lead is captured

4. **Create Admin Dashboard** (Optional)
   - Build a simple UI to view/manage leads
   - Add filters, export to CSV, etc.

---

## Troubleshooting

### Server won't start?
- Check `.env` file exists and has correct values
- Verify Python packages are installed: `pip install -r requirements.txt`

### Form submission fails?
- Check Flask server is running on port 8000
- Check browser console for errors (F12)
- Verify API endpoint in `lc-script.js` is correct

### Data not appearing in Supabase?
- Check server terminal for error messages
- Verify RLS policy is set correctly
- Check you're using the `service_role` key, not `anon` key

---

## 🎉 Success!

Your lead capture system is now fully integrated with Supabase and ready to collect leads!

**Test it now:**
1. Open `http://localhost:8000/index.html`
2. Submit a test lead
3. Check Supabase dashboard to see your data!
