import requests


WORMS_BASE_URL = "https://www.marinespecies.org/rest/"
ATTRIBUTE_BY_ID = "AphiaAttributesByAphiaID/{id}"


def fetch_worms(aphiaIds: list):
    results = []

    for id in aphiaIds:
        res = requests.get(url=WORMS_BASE_URL + ATTRIBUTE_BY_ID.format(id=id))
        try:
            res.raise_for_status()
            results += res.json()
        except:
            print(f"AphiaId {id} failed to fetch")

    return results
