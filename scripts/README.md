# Species Information Fetch Scripts

## Sources Used

1. Wikidata
2. Wikipedia
3. WoRMs

Initially using a SPARQL query, all species that have one of the parent taxonomy
classes specified in `wikidata.py` are fetched with their appropriate fields and
keys for the Wikipedia and WoRMs pages.

The information (introduction paragraphs and extra attributes) from the two
sites are also fetched later on to enrich the original Wikidata information.

## Configuration & Running

### Virtual Environment & Dependencies

Make sure you are located in the `scripts/` directory and run the following
commands.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Make sure MongoDB is running and the environment file `MONGO_URL` is setup in a
`.env` located in the project root directory.

### Running

```bash
python refresh_speciesbase.py
```

This should create roughly four thousand entries into the `wikidata` collection,
which is much smaller because we are guaranteeing certain properties such as
common name, images, and AlphiaIDs (for WoRMs).
