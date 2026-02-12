import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_bot(url, bot_name):
    print(f"\n--- Checking {url} as {bot_name} ---")
    try:
        headers = {'User-Agent': bot_name}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx) as response:
            print(f"Status: {response.getcode()}")
            print(f"Content-Type: {response.getheader('Content-Type')}")
            # Check for any Vercel protection headers
            for h in ['x-vercel-protection', 'x-robots-tag']:
                val = response.getheader(h)
                if val: print(f"{h}: {val}")
    except Exception as e:
        print(f"Error: {e}")

url = "https://my-project-tan-alpha.vercel.app/sitemap.xml"
check_bot(url, "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
check_bot(url, "Mozilla/5.0")
