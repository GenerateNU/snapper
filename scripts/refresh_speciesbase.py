from pymongo import MongoClient
import os
from dotenv import load_dotenv
import pandas as pd

from wikidata import Wikidata
from wikipedia import get_intros
from worms import fetch_worms

load_dotenv(dotenv_path="../.env")

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["speciesbase"]


def populate_wikidata():
    wikidata = db["wikidata"]

    wikidata_iter = iter(Wikidata())

    for batch in wikidata_iter:
        df = pd.DataFrame.from_dict(batch)

        batch_out = []
        for fish, info in df.groupby("fish"):
            out = info.drop(columns=["common_name", "image_url"])
            out = out.rename(columns={"fish": "_id"})
            out = out.iloc[0].to_dict()
            out["common_names"] = list(set(info["common_name"].to_list()))
            out["image_urls"] = list(set(info["image_url"].to_list()))
            batch_out.append(out)

        n = wikidata.insert_many(batch_out, ordered=False)
        print("Inserted:", len(n.inserted_ids))


def populate_wikipedia_intros():
    wikidata = db["wikidata"]
    BATCH_SIZE = 20

    pages = (wikidata.count_documents({}) // BATCH_SIZE) + 1
    for i in range(pages):
        titles = [
            item["article_suffix"]
            for item in wikidata.find({}, {}).limit(BATCH_SIZE).skip(i * BATCH_SIZE)
        ]

        title_to_intro = get_intros(titles)

        for title in title_to_intro:
            intro = title_to_intro[title]
            wikidata.update_one({"article_suffix": title}, {"$set": {"intro": intro}})


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
    populate_wikidata()
    populate_wikipedia_intros()
    populate_worms()


if __name__ == "__main__":
    main()
