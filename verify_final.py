import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_url(url):
    print(f"Checking: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'})
        with urllib.request.urlopen(req, context=ctx) as response:
            print(f"  Status: {response.getcode()}")
            print(f"  Type: {response.headers.get('Content-Type')}")
    except Exception as e:
        print(f"  FAILED: {e}")

base = "https://my-project-tan-alpha.vercel.app"
urls = [
    f"{base}/sitemap_index.xml",
    f"{base}/index.html",
    f"{base}/index",
    f"{base}/",
    f"{base}/about",
    f"{base}/solutions",
    f"{base}/contact"
]

for u in urls:
    check_url(u)
    print("-" * 20)
