import os
import httpx

NYT_BASE = "https://api.nytimes.com/svc/mostpopular/v2"

def _pick_image(media: list) -> str | None:
    """
    Intenta obtener una imagen utilizable:
    - Prioriza mediumThreeByTwo440
    - Si no existe, usa la última disponible
    """
    if not media:
        return None

    for m in media:
        meta = m.get("media-metadata") or []
        for item in meta:
            if item.get("format") == "mediumThreeByTwo440":
                return item.get("url")
        if meta:
            return meta[-1].get("url")

    return None

async def fetch_most_viewed(period: int = 7) -> list[dict]:
    api_key = os.getenv("NYT_API_KEY")
    if not api_key:
        raise RuntimeError("NYT_API_KEY no está configurada en el .env")

    url = f"{NYT_BASE}/viewed/{period}.json"
    params = {"api-key": api_key}

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()

    results = data.get("results", [])

    transformed = []
    for a in results:
        transformed.append({
            "id": a.get("id"),
            "title": a.get("title"),
            "abstract": a.get("abstract"),
            "url": a.get("url"),
            "section": a.get("section"),
            "byline": a.get("byline"),
            "published_date": a.get("published_date"),
            "image_url": _pick_image(a.get("media", [])),
        })

    return transformed

async def ping_nyt() -> bool:
    """
    Para /health: verifica si NYT responde con status OK.
    """
    api_key = os.getenv("NYT_API_KEY")
    if not api_key:
        return False

    url = f"{NYT_BASE}/viewed/1.json"
    params = {"api-key": api_key}

    try:
        async with httpx.AsyncClient(timeout=6) as client:
            r = await client.get(url, params=params)
            if r.status_code != 200:
                return False
            data = r.json()
            return data.get("status") == "OK"
    except Exception:
        return False
