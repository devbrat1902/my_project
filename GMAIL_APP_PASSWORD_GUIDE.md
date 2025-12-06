# How to Get Your Gmail App Password (Step-by-Step)

Google blocks regular passwords (like `dev#1234`) for security when used by outside apps like your website. You need a special "App Password".

## Step 1: Enable 2-Step Verification (If not already done)
1. Go to **[Google Account Security](https://myaccount.google.com/security)**.
2. Scroll down to "How you sign in to Google".
3. Look for **2-Step Verification**.
   - If it says "Off", click it and turn it **ON**. (You'll need to verify with your phone).
   - If it says "On", skip to Step 2.

## Step 2: Generate the App Password
1. Go to the **[App Passwords page](https://myaccount.google.com/apppasswords)**.
   - *Note: If this link doesn't work, go to Security > 2-Step Verification > scroll to bottom > App Passwords.*
2. You might be asked to sign in again.
3. You will see two dropdown menus:
   - **Select app**: Choose **"Mail"**.
   - **Select device**: Choose **"Other (Custom name)"**.
4. Type a name like **"My Website"** or "Lead Capture".
5. Click **Generate**.

## Step 3: Copy the Code
1. A yellow box will appear with a 16-letter code (example: `abcd efgh ijkl mnop`).
2. **Copy this code.**
3. This is your **SMTP_PASSWORD**.

## Step 4: Update Your Project
1. Open the `.env` file in your project.
2. Find the line: `SMTP_PASSWORD=...`
3. Paste the 16-letter code there (remove the spaces).

Example:
```env
SMTP_PASSWORD=abcdefghijklmnop
```
(Do not use `dev#1234`)

## Step 5: Restart Server
1. Stop the running server (Ctrl+C).
2. Run `python app.py` again.
