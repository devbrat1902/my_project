import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def check_redirect(url):
    print(f"\n--- Checking redirects for {url} ---")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx) as response:
            print(f"Final URL: {response.geturl()}")
            print(f"Status: {response.getcode()}")
            if response.geturl() != url:
                print("!! REDIRECT DETECTED !!")
            else:
                print("No redirect.")
    except Exception as e:
        print(f"Error: {e}")

check_redirect("https://my-project-tan-alpha.vercel.app/")
check_redirect("https://my-project-tan-alpha.vercel.app/about")
check_redirect("https://my-project-tan-alpha.vercel.app/index.html")
