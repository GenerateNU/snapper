# pip install sparqlwrapper
# https://rdflib.github.io/sparqlwrapper/

import sys
from SPARQLWrapper import SPARQLWrapper, JSON

ENDPOINT_URL = "https://query.wikidata.org/sparql"

# Query URL: https://w.wiki/C6u5
QUERY = """SELECT ?common_name ?locationLabel ?scientificName ?species ?speciesLabel ?genus ?genusLabel ?family ?familyLabel ?order ?orderLabel ?class ?classLabel ?phylum ?phylumLabel ?kingdom ?kingdomLabel ?domain ?domainLabel ?articleUrl ?articleTitle ?aphiaId ?image_url
WHERE {{  
  BIND(wd:Q19088 AS ?domain).
  BIND(wd:Q729 AS ?kingdom).
  BIND(wd:Q10915 AS ?phylum).
  BIND(wd:{class_qid} AS ?class).
  
  ?order wdt:P171* ?class.
  ?order wdt:P105 wd:Q36602.
  
  ?family wdt:P171* ?order.
  ?family wdt:P105 wd:Q35409.
  
  ?genus wdt:P171* ?family.
  ?genus wdt:P105 wd:Q34740.
  
  ?species wdt:P171* ?genus.
  ?species wdt:P105 wd:Q7432.
  
  ?species wdt:P850 ?aphiaId.
  ?species wdt:P18 ?image_url.
  ?species wdt:P225 ?scientificName.
  
  ?species wdt:P1843 ?common_name.
  ?articleUrl schema:about ?species .
  ?articleUrl schema:inLanguage ?lang ;
           schema:name ?articleTitle;
           schema:isPartOf <https://en.wikipedia.org/> .
  
  OPTIONAL {{?species wdt:P9714 ?location.}}
  
  FILTER(LANGMATCHES(LANG(?common_name), "en"))
  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
}}
LIMIT {limit}
OFFSET {offset}
"""

MARINE_CLASSES = [
    "Q127282",  # "Actinopterygii",
    "Q4867740",  # "Gastropoda",
    "Q182978",  # "Malacostraca",
    "Q25368",  # "Bivalvia",
    "Q28524",  # "Anthozoa",
    "Q194257",  # "Elasmobranchii",
    "Q25349",  # "Asteroidea",
    "Q188906",  # "Polyplacophora",
    "Q47544996",  # "Hexanauplia",
    "Q83483",  # "Echinoidea",
    "Q272388",  # "Scyphozoa",
    "Q128257",  # "Cephalopoda",
    "Q181989",  # "Hydrozoa",
    "Q190090",  # "Ascidiacea",
    "Q127470",  # "Holothuroidea",
    "Q59256",  # "Ophiuroidea",
]


class Wikidata:
    def __iter__(self, amount_per_page=1_000):
        self.offset = 0
        self.curr_class = 0
        self.amount_per_page = amount_per_page
        return self

    def get_results(endpoint_url, query):
        user_agent = "WDQS-example Python/%s.%s" % (
            sys.version_info[0],
            sys.version_info[1],
        )
        # TODO adjust user agent; see https://w.wiki/CX6
        sparql = SPARQLWrapper(endpoint_url, agent=user_agent)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        return sparql.query().convert()

    def __next__(self):
        results = {"results": {"bindings": []}}

        while self.curr_class < len(MARINE_CLASSES):
            print("Fetching from", MARINE_CLASSES[self.curr_class])
            query = QUERY.format(
                class_qid=MARINE_CLASSES[self.curr_class],
                limit=self.amount_per_page,
                offset=self.offset * self.amount_per_page,
            )

            results = Wikidata.get_results(ENDPOINT_URL, query)

            self.offset += 1

            for row in results["results"]["bindings"]:
                for key in row:
                    row[key] = row[key]["value"]

            if len(results["results"]["bindings"]) == 0:
                self.curr_class += 1
                self.offset = 0
            else:
                return results["results"]["bindings"]

        raise StopIteration
