import os

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from pymongo import MongoClient, errors

from icon_mapping import ICON_MAPPING
from wikidata import Wikidata
from wikipedia import get_intros
from worms import fetch_worms

load_dotenv(dotenv_path="../.env")

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)
db = client["test"]


TAXONOMY = [
    "domain",
    "kingdom",
    "phylum",
    "class",
    "order",
    "family",
    "genus",
    "species",
]


def populate_wikidata():
    wikidata = db["species"]
    wikidata.drop()

    wikidata_iter = iter(Wikidata())

    for batch in wikidata_iter:
        df = pd.DataFrame.from_dict(batch)

        batch_out = []
        for species, info in df.groupby("species"):
            out = info.drop(columns=["common_name", "image_url"])
            if "locationLabel" in info.columns:
                out = out.drop(columns="locationLabel")
            else:
                info["locationLabel"] = pd.Series(dtype="object")

            # Replace NaN with None in the locationLabel column
            info["locationLabel"] = info["locationLabel"].replace({np.nan: None})

            for taxon in TAXONOMY:
                taxon_qids = out[taxon].str.split("/").str[-1]

                out = out.drop(columns=[f"{taxon}Label"])

                out[taxon] = taxon_qids
            out = out.iloc[0].to_dict()
            out["commonNames"] = list(set(info["common_name"].to_list()))
            out["imageUrls"] = list(set(info["image_url"].to_list()))
            if "locationLabel" in info.columns:
                # Filter out None values to avoid NaN in the locations list
                out["locations"] = [
                    loc
                    for loc in set(info["locationLabel"].to_list())
                    if loc is not None
                ]
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
            wikidata.update_one(
                {"articleTitle": title}, {"$set": {"introduction": intro}}
            )


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


def add_icons():
    for taxon in TAXONOMY:
        wikidata = db["species"]

        for qid, icon_url in ICON_MAPPING.items():
            wikidata.update_many({taxon: qid}, {"$set": {"iconUrl": icon_url}})


def main():
    populate_wikidata()
    populate_wikipedia_intros()
    add_icons()


if __name__ == "__main__":
    main()
