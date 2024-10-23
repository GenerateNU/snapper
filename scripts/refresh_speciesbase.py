from pymongo import MongoClient
import os
from dotenv import load_dotenv

from wikidata import Wikidata
from worms import fetch_worms

load_dotenv(dotenv_path="../.env")

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["speciesbase"]


def populate_wikidata():
    wikidata = db["wikidata"]

    wikidata_iter = iter(Wikidata())

    for batch in wikidata_iter:
        n = wikidata.insert_many(batch)
        print("Inserted:", len(n.inserted_ids))


def populate_worms():
    wikidata = db["wikidata"]
    worms = db["worms"]

    BATCH_SIZE = 10

    pages = (wikidata.count_documents({}) // BATCH_SIZE) + 1

    for i in range(pages):
        batch = [
            item["wormsLabel"]
            for item in wikidata.find({}, {}).limit(BATCH_SIZE).skip(i * BATCH_SIZE)
        ]
        attributes = fetch_worms(batch)
        print(attributes)
        n = worms.insert_many(attributes)
        print("Inserted:", len(n.inserted_ids))


def main():
    # populate_wikidata()
    populate_worms()


if __name__ == "__main__":
    main()
