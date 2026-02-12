from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Enable CORS for all routes

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_KEY')

if not supabase_url or not supabase_key:
    print('❌ ERROR: Missing Supabase credentials!')
    print('Please check your .env file has:')
    print('SUPABASE_URL=your_project_url')
    print('SUPABASE_SERVICE_KEY=your_service_role_key')
    exit(1)

supabase: Client = create_client(supabase_url, supabase_key)

# Email configuration
NOTIFICATION_EMAIL = "devbrat1office@gmail.com"

# Function to send email notification
def send_email_notification(lead_data):
    """Send email notification with lead details"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Lead Submission - {lead_data['email']}"
        msg['From'] = "Just For Kidz Lead Capture <noreply@justforkidz.com>"
        msg['To'] = NOTIFICATION_EMAIL
        
        # Create HTML email body
        html_body = f"""
        <html>
          <head>
            <style>
              body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
              .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
              .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
              .content {{ background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }}
              .field {{ margin-bottom: 15px; padding: 10px; background-color: white; border-left: 3px solid #2563eb; }}
              .label {{ font-weight: bold; color: #1f2937; margin-bottom: 5px; }}
              .value {{ color: #4b5563; }}
              .footer {{ background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 5px 5px; }}
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Lead Captured!</h1>
                <p>Just For Kidz - Lead Capture System</p>
              </div>
              
              <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Lead Details</h2>
                
                <div class="field">
                  <div class="label">📧 Email Address:</div>
                  <div class="value">{lead_data['email']}</div>
                </div>
                
                <div class="field">
                  <div class="label">📱 Phone Number:</div>
                  <div class="value">{lead_data['phone']}</div>
                </div>
                
                <div class="field">
                  <div class="label">🌐 Page URL:</div>
                  <div class="value">{lead_data['page_url']}</div>
                </div>
                
                <div class="field">
                  <div class="label">🔗 Referrer:</div>
                  <div class="value">{lead_data['referrer'] or 'Direct Visit'}</div>
                </div>
                
                <div class="field">
                  <div class="label">🕐 Timezone:</div>
                  <div class="value">{lead_data['timezone']}</div>
                </div>
                
                <div class="field">
                  <div class="label">💻 User Agent:</div>
                  <div class="value" style="font-size: 11px; word-break: break-all;">{lead_data['user_agent']}</div>
                </div>
                
                <div class="field">
                  <div class="label">📅 Submission Time:</div>
                  <div class="value">{datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}</div>
                </div>
              </div>
              
              <div class="footer">
                <p>This is an automated notification from Just For Kidz Lead Capture System</p>
                <p>Please do not reply to this email</p>
              </div>
            </div>
          </body>
        </html>
        """
        
        # Attach HTML body
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        # Send email using Gmail SMTP
        print(f"Email notification prepared for: {NOTIFICATION_EMAIL}")
        
        # SMTP Configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_username = os.getenv('SMTP_USERNAME')  # Your Gmail address
        smtp_password = os.getenv('SMTP_PASSWORD')  # Gmail app password
        
        if smtp_username and smtp_password:
            try:
                with smtplib.SMTP(smtp_server, smtp_port) as server:
                    server.starttls()
                    server.login(smtp_username, smtp_password)
                    server.send_message(msg)
                print("Email sent successfully!")
            except Exception as smtp_error:
                print(f"SMTP Error: {str(smtp_error)}")
                print("Email prepared but not sent. Check SMTP credentials.")
                return False
        else:
            print("Note: SMTP credentials not configured. Email not sent.")
            print("Add SMTP_USERNAME and SMTP_PASSWORD to .env file")
            return False
        
        return True
        
    except Exception as e:
        print(f"Email notification error: {str(e)}")
        return False

# Serve homepage
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Server is running'}), 200

# Lead capture endpoint
@app.route('/api/lead', methods=['POST'])
def capture_lead():
    try:
        data = request.get_json()
        
        # Extract data
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        page_url = data.get('pageUrl', '')
        referrer = data.get('referrer', '')
        user_agent = data.get('userAgent', '')
        timezone = data.get('timezone', '')
        
        # Validation
        if not phone:
            return jsonify({
                'error': 'Missing required fields',
                'message': 'Phone number is required'
            }), 400
        
        # Email validation (only if provided)
        if email:
            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, email):
                return jsonify({
                    'error': 'Invalid email',
                    'message': 'Please provide a valid email address'
                }), 400
        else:
            email = None # Explicitly set to None for Supabase nullable column
        
        # Prepare data for Supabase
        lead_data = {
            'email': email,
            'phone': phone,
            'page_url': page_url,
            'referrer': referrer,
            'user_agent': user_agent,
            'timezone': timezone,
            'status': 'new'
        }
        
        print('--- New Lead Submission ---')
        print(f'Email: {email}')
        print(f'Phone: {phone}')
        print(f'Page URL: {page_url}')
        print(f'Timezone: {timezone}')
        
        # Insert into Supabase
        response = supabase.table('leads').insert(lead_data).execute()
        
        if response.data:
            lead_id = response.data[0]['id']
            print(f'SUCCESS: Lead saved successfully!')
            print(f'Lead ID: {lead_id}')
            
            # Send email notification
            email_sent = send_email_notification(lead_data)
            if email_sent:
                print('Email notification sent successfully!')
            else:
                print('Email notification failed (but lead was saved)')
            
            print('---------------------------')
            
            return jsonify({
                'message': 'Lead captured successfully',
                'leadId': lead_id
            }), 200
        else:
            raise Exception('Failed to insert lead')
            
    except Exception as e:
        import traceback
        print(f'ERROR: {str(e)}')
        print('Traceback:')
        traceback.print_exc()
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

# Get all leads (for admin/testing)
@app.route('/api/leads', methods=['GET'])
def get_leads():
    try:
        response = supabase.table('leads').select('*').order('created_at', desc=True).limit(100).execute()
        
        return jsonify({
            'leads': response.data,
            'count': len(response.data)
        }), 200
        
    except Exception as e:
        print(f'ERROR: {str(e)}')
        return jsonify({
            'error': 'Server error',
            'message': 'Failed to fetch leads'
        }), 500

if __name__ == '__main__':
    print('Server started successfully!')
    print(f'Running at: http://localhost:8000')
    print(f'Lead API: http://localhost:8000/api/lead')
    print(f'Database: Connected to Supabase')
    print('-----------------------------------')
    app.run(port=8000, debug=True)
