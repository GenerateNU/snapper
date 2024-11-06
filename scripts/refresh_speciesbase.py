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
db = client["test"]


def populate_wikidata():
    wikidata = db["species"]

    wikidata_iter = iter(Wikidata())

    for batch in wikidata_iter:
        df = pd.DataFrame.from_dict(batch)

        """
        aphiaId: { type: String, required: true },
        articleUrl: { type: String },
        articleTitle: { type: String },
        commonNames: [String],
        scientificName: { type: String },
        introduction: { type: String },
        imageUrls: [String],
        """

        batch_out = []
        for fish, info in df.groupby("fish"):
            out = info.drop(columns=["common_name", "image_url"])
            out = out.rename(columns={"fish": "_id", "aphia_id": "aphiaId", "article": "articleUrl", "article_suffix": "articleTitle", "scientific_name": "scientificName", "intro": "introduction"})
            out = out.iloc[0].to_dict()
            out["commonNames"] = list(set(info["common_name"].to_list()))
            out["imageUrls"] = list(set(info["image_url"].to_list()))
            batch_out.append(out)

        try:
            n = wikidata.insert_many(batch_out, ordered=False)
            print("Inserted:", len(n.inserted_ids))
        except:
            print("Error inserting documents")


def populate_wikipedia_intros():
    wikidata = db["species"]
    BATCH_SIZE = 20

    pages = (wikidata.count_documents({}) // BATCH_SIZE) + 1
    for i in range(pages):
        titles = [
            item["articleTitle"]
            for item in wikidata.find({}, {}).limit(BATCH_SIZE).skip(i * BATCH_SIZE)
        ]

        title_to_intro = get_intros(titles)

        for title in title_to_intro:
            intro = title_to_intro[title]
            wikidata.update_one({"articleTitle": title}, {"$set": {"intro": intro}})


def populate_worms():
    wikidata = db["species"]
    worms = db["worms"]

    BATCH_SIZE = 10

    pages = (wikidata.count_documents({}) // BATCH_SIZE) + 1

    for i in range(pages):
        try:
            batch = [
                item["aphia_id"]
                for item in wikidata.find({}, {}).limit(BATCH_SIZE).skip(i * BATCH_SIZE)
                if item.get("aphia_id")
            ]
            attributes = fetch_worms(batch)
            print(attributes)
            n = worms.insert_many(attributes, ordered=False)
            print("Inserted:", len(n.inserted_ids))
        except Exception as e:
            print("Error when fetching and/or inserting worms", e)


def main():
    # populate_wikidata()
    populate_wikipedia_intros()
    # populate_worms()


if __name__ == "__main__":
    main()
