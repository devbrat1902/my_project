# Supabase Integration - Step-by-Step Guide

## 📋 What You Need to Do

Follow these steps **in order** to connect your lead capture system to Supabase.

---

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in the details:
   ```
   Name: just-for-kidz-leads
   Database Password: [Create a strong password - SAVE THIS!]
   Region: Southeast Asia (Singapore) [closest to India]
   ```
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

---

## Step 2: Create Database Table

### 2.1 Open Table Editor
1. In your Supabase dashboard, click **"Table Editor"** in the left sidebar
2. Click **"Create a new table"**

### 2.2 Configure Table
1. **Table name**: `leads`
2. **Enable Row Level Security (RLS)**: ✅ **CHECK THIS BOX**
3. Click **"Save"**

### 2.3 Add Columns
Click **"Add Column"** for each of these:

| Column Name | Type | Default Value | Is Nullable | Is Unique |
|------------|------|---------------|-------------|-----------|
| `id` | `uuid` | `gen_random_uuid()` | ❌ No | ✅ Yes (Primary) |
| `created_at` | `timestamptz` | `now()` | ❌ No | ❌ No |
| `email` | `text` | - | ❌ No | ❌ No |
| `phone` | `text` | - | ❌ No | ❌ No |
| `page_url` | `text` | - | ✅ Yes | ❌ No |
| `referrer` | `text` | - | ✅ Yes | ❌ No |
| `user_agent` | `text` | - | ✅ Yes | ❌ No |
| `timezone` | `text` | - | ✅ Yes | ❌ No |
| `status` | `text` | `'new'` | ❌ No | ❌ No |

4. Click **"Save"** after adding all columns

---

## Step 3: Configure Security

### 3.1 Set Up RLS Policy
1. Go to **Authentication** → **Policies** in the left sidebar
2. Find the `leads` table
3. Click **"New Policy"**
4. Click **"Create policy from scratch"**
5. Fill in:
   ```
   Policy name: Allow service role to insert
   Policy command: INSERT
   Target roles: service_role
   ```
6. In the **USING expression**, enter: `true`
7. Click **"Review"** then **"Save policy"**

---

## Step 4: Get Your API Keys

### 4.1 Copy Credentials
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:

**Copy these exactly:**

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
```

```
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
(This is a very long string)
```

```
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
(This is also a very long string, DIFFERENT from anon key)
```

> ⚠️ **IMPORTANT**: Keep the `service_role` key secret! Never share it publicly.

---

## Step 5: Install Dependencies

### 5.1 Open Terminal
Open your terminal in the project folder:
```bash
cd c:\Users\DEVBRAT\OneDrive\Desktop\my_project
```

### 5.2 Install Required Packages
```bash
npm install @supabase/supabase-js dotenv
```

Wait for installation to complete.

---

## Step 6: Create Environment File

### 6.1 Create `.env` File
1. In your project folder, create a new file called `.env` (exactly this name)
2. Add this content (replace with YOUR actual values):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
PORT=3000
```

**Example** (with fake values):
```env
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYxNjQzMjAwMCwiZXhwIjoxOTMxOTkyMDAwfQ.1234567890abcdefghijklmnopqrstuvwxyz
PORT=3000
```

3. **Save the file**

### 6.2 Add to .gitignore
If you have a `.gitignore` file, add this line:
```
.env
```

If you don't have `.gitignore`, create it and add:
```
node_modules/
.env
```

---

## Step 7: Test the Integration

### 7.1 Start the Server
In your terminal:
```bash
node server.js
```

You should see:
```
🚀 Server started successfully!
📍 Running at: http://localhost:3000
📊 Lead API: http://localhost:3000/api/lead
💾 Database: Connected to Supabase
```

### 7.2 Test the Form
1. Open your browser to `http://localhost:8000/index.html`
2. Wait for the modal to appear
3. Fill in the form:
   - Email: `test@example.com`
   - Phone: `9876543210`
   - Check the consent box
4. Click **"Submit"**

### 7.3 Verify in Supabase
1. Go back to your Supabase dashboard
2. Click **"Table Editor"**
3. Click on the `leads` table
4. You should see your test entry!

---

## Step 8: Update Frontend API Endpoint

### 8.1 Edit `lc-script.js`
Find this line (around line 5):
```javascript
const API_ENDPOINT = '/api/lead';
```

Change it to:
```javascript
const API_ENDPOINT = 'http://localhost:3000/api/lead';
```

### 8.2 Test Again
1. Refresh your browser
2. Submit another test lead
3. Check Supabase - you should see 2 entries now!

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] `leads` table created with all columns
- [ ] RLS policy configured
- [ ] API keys copied
- [ ] Dependencies installed (`@supabase/supabase-js`, `dotenv`)
- [ ] `.env` file created with correct values
- [ ] Server starts without errors
- [ ] Test lead appears in Supabase table

---

## 🆘 Troubleshooting

### Error: "Missing Supabase credentials"
**Solution**: Check your `.env` file exists and has the correct values

### Error: "Failed to insert row"
**Solution**: 
1. Check RLS policy is set correctly
2. Verify you're using the `service_role` key, not the `anon` key

### Error: "CORS error"
**Solution**: Make sure your server is running on port 3000

### No data appearing in Supabase
**Solution**:
1. Check browser console for errors
2. Verify API endpoint in `lc-script.js` is correct
3. Check server terminal for error messages

---

## 📞 Need Help?

If you get stuck, check:
1. Server terminal for error messages
2. Browser console (F12) for frontend errors
3. Supabase dashboard → Logs for database errors

---

## 🎉 Next Steps (Optional)

Once everything works:

1. **View Your Leads**: Visit `http://localhost:3000/api/leads` to see all leads as JSON
2. **Add Email Notifications**: Set up SendGrid or similar
3. **Create Admin Dashboard**: Build a simple UI to manage leads
4. **Deploy to Production**: Use Vercel, Heroku, or similar

---

**You're all set!** Your lead capture system is now saving data to Supabase. 🚀
