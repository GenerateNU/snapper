import requests

BASE_URL = "https://en.wikipedia.org/w/api.php?"
QUERY = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=Bartail%20flathead%7CDotted%20butterflyfish%7CCentropyge%20tibicen&formatversion=2&exintro=1&explaintext=1"


def get_intros(titles: list[str]) -> dict[list[str]]:
    params = {
        "action": "query",
        "format": "json",
        "prop": "extracts",
        "formatversion": 2,
        "exintro": 1,
        "explaintext": 1,
        "exsectionformat": "wiki",
        "titles": "|".join(titles),
    }

    res = requests.get(url=BASE_URL, params=params)
    res.raise_for_status()

    out = {}

    print(res.json())

    for page in res.json()["query"]["pages"]:
        out[page["title"]] = page.get("extract")

    return out
