from pymongo import MongoClient
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np

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
            if "locationLabel" in info.columns:
                out = out.drop(columns="locationLabel")
            else:
                info["locationLabel"] = pd.Series(dtype='object')

            # Replace NaN with None in the locationLabel column
            info["locationLabel"] = info["locationLabel"].replace({np.nan: None})

            out['fish'] = out['fish'].str.split('/').str[-1]
            out = out.rename(columns={"fish": "_id" })
            out = out.iloc[0].to_dict()
            out["commonNames"] = list(set(info["common_name"].to_list()))
            out["imageUrls"] = list(set(info["image_url"].to_list()))
            if "locationLabel" in info.columns:
                # Filter out None values to avoid NaN in the locations list
                out["locations"] = [loc for loc in set(info["locationLabel"].to_list()) if loc is not None]
            else:
                out["locations"] = []  # Empty list if locationLabel column is missing
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
            wikidata.update_one({"articleTitle": title}, {"$set": {"introduction": intro}})


def populate_worms():
    wikidata = db["species"]
    worms = db["worms"]

    BATCH_SIZE = 10

    pages = (wikidata.count_documents({}) // BATCH_SIZE) + 1

    for i in range(pages):
        try:
            batch = [
                item["aphiaId"]
                for item in wikidata.find({}, {}).limit(BATCH_SIZE).skip(i * BATCH_SIZE)
                if item.get("aphiaId")
            ]
            attributes = fetch_worms(batch)
            print(attributes)
            n = worms.insert_many(attributes, ordered=False)
            print("Inserted:", len(n.inserted_ids))
        except Exception as e:
            print("Error when fetching and/or inserting worms", e)


def main():
    populate_wikidata()
    populate_wikipedia_intros()
    # populate_worms()


if __name__ == "__main__":
    main()
