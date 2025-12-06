# How to Enable 2-Step Verification

The error "The setting you are looking for is not available" means **2-Step Verification is OFF**. You must turn it on first.

## Step 1: Enable 2-Step Verification
1.  **Click this link:** [https://myaccount.google.com/signinoptions/two-step-verification](https://myaccount.google.com/signinoptions/two-step-verification)
2.  Click **"Get Started"**.
3.  Enter your password (`dev#1234`) if asked.
4.  Add your phone number and verify it with the code sent to your phone.
5.  **IMPORTANT:** Click **"TURN ON"** at the end.

## Step 2: Now Create the App Password
1.  Once 2-Step Verification is ON, go back to: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2.  Now the page will work!
3.  Select **Mail** -> **Other** -> Generate.
4.  Copy the 16-letter code.

## Step 3: Update Project
1.  Paste the code into your `.env` file:
    ```env
    SMTP_PASSWORD=abcdefghijklmnop
    ```
