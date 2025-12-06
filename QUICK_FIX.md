# Quick Fix Instructions

## The Problem
You had two servers trying to run on port 8000:
1. Python HTTP server (serving HTML files)
2. Flask server (handling API)

This caused a CORS error because they couldn't both use the same port.

## The Solution
I've updated Flask to serve BOTH the HTML files AND handle the API requests.

## Steps to Fix:

### 1. Stop the Python HTTP Server
If you're running `python -m http.server 8000`, **stop it** (press Ctrl+C in that terminal).

### 2. Restart the Flask Server
```bash
python app.py
```

### 3. Test the Application
1. Open your browser to: `http://localhost:8000`
2. The modal should appear
3. Fill in the form and submit
4. Check your Supabase dashboard to see the data!

## What Changed:
- ✅ Flask now serves static files (HTML, CSS, JS)
- ✅ Flask handles the `/api/lead` endpoint
- ✅ API endpoint changed to relative path `/api/lead`
- ✅ No more CORS errors!

## Everything runs on ONE server now (port 8000)
