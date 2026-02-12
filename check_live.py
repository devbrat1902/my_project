import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_url(url):
    print(f"\n--- Checking {url} ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx) as response:
            print(f"Status: {response.getcode()}")
            print(f"Content-Type: {response.getheader('Content-Type')}")
            content = response.read().decode('utf-8')
            print(f"Content Length: {len(content)}")
            print("Contains 'Verification' comment:" if "Verification" in content else "MISSING 'Verification' comment")
            print("First 200 chars:")
            print(content[:200])
            if "robots.txt" in url:
                print("Full content of robots.txt:")
                print(content)
    except Exception as e:
        print(f"Error: {e}")

check_url("https://my-project-tan-alpha.vercel.app/robots.txt")
check_url("https://my-project-tan-alpha.vercel.app/sitemap.xml")
