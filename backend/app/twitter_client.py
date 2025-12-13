import os
import requests

X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN")
TWITTER_TRENDS_URL = "https://api.twitter.com/1.1/trends/place.json"

def get_trends_for_location(woeid: int = 23424900):
    headers = {
        "Authorization": f"Bearer {X_BEARER_TOKEN}"
    }
    params = {"id": woeid}
    resp = requests.get(TWITTER_TRENDS_URL, headers=headers, params=params)
    resp.raise_for_status()
    data = resp.json()
    trends_raw = data[0]["trends"]

    transformed = []
    for t in trends_raw[:10]:
        transformed.append({
            "name": t["name"],
            "url": t["url"],
            "tweet_volume": t["tweet_volume"],
        })
    return transformed
