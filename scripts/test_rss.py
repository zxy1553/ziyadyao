import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://www.jiqizhixin.com/rss"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        content = response.read().decode('utf-8')
        print(content[:1000])
except Exception as e:
    print(f"Error: {e}")
