import urllib.request
import ssl

url = "https://my-project-tan-alpha.vercel.app/sitemap.xml"
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        print(f"Status Code: {response.getcode()}")
        print("Headers:")
        for key, value in response.getheaders():
            print(f"{key}: {value}")
        print("\nFirst 100 chars of content:")
        print(response.read(100).decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
