import requests

url = "https://my-project-tan-alpha.vercel.app/sitemap.xml"
try:
    response = requests.get(url, timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Headers:")
    for key, value in response.headers.items():
        print(f"{key}: {value}")
    print("\nFirst 100 chars of content:")
    print(response.text[:100])
except Exception as e:
    print(f"Error: {e}")
