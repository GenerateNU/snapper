export type SpeciesContent = {
    commonName: string,
    scientificName: string,
    introduction: string,
    images: string[],
}

// Dummy species
export const redSnapper: SpeciesContent = {
    commonName: "Red Snapper",
    scientificName: "Lutjanus campechanus",
    introduction: "The northern red snapper (Lutjanus campechanus) is a species of marine ray-finned fish, a snapper belonging to the family Lutjanidae. It is native to the western Atlantic Ocean, the Caribbean Sea, and the Gulf of Mexico, where it inhabits environments associated with reefs. This species is commercially important and is also sought-after as a game fish.[2]",
    images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Red_Snapper.jpg/2560px-Red_Snapper.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Lutjanus_campechanus.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/30/Lucam_u0.gif",
        "https://upload.wikimedia.org/wikipedia/commons/8/8b/Lutjanus_campechanus.png",
    ]
}

export const greatWhite: SpeciesContent = {
    commonName: "Great white shark",
    scientificName: "Carcharodon carcharias",
    introduction: "The great white shark (Carcharodon carcharias), also known as the white shark, white pointer, or simply great white, is a species of large mackerel shark which can be found in the coastal surface waters of all the major oceans. It is the only known surviving species of its genus Carcharodon. The great white shark is notable for its size, with the largest preserved female specimen measuring 5.83 m (19.1 ft) in length and around 2,000 kg (4,400 lb) in weight at maturity.[3] However, most are smaller; males measure 3.4 to 4.0 m (11 to 13 ft), and females measure 4.6 to 4.9 m (15 to 16 ft) on average.[4][5] According to a 2014 study, the lifespan of great white sharks is estimated to be as long as 70 years or more, well above previous estimates,[6] making it one of the longest lived cartilaginous fishes currently known.[7] According to the same study, male great white sharks take 26 years to reach sexual maturity, while the females take 33 years to be ready to produce offspring.[8] Great white sharks can swim at speeds of 25 km/h (16 mph)[9] for short bursts and to depths of 1,200 m (3,900 ft).[10]",
    images: [
        "https://upload.wikimedia.org/wikipedia/commons/4/4b/Great_white_shark.jpg",
    ]
}

export const cuttlefish: SpeciesContent = {
    commonName: "Common cuttlefish",
    scientificName: "Sepia officinalis",
    introduction: "The common cuttlefish or European common cuttlefish (Sepia officinalis) is one of the largest and best-known cuttlefish species. They are a migratory species that spend the summer and spring inshore for spawning and then move to depths of 100–200 metres (330–660 ft) during autumn and winter.[2] They grow to 49 centimetres (19 in) in mantle length and 4 kilograms (8.8 lb) in weight.[3] Animals from subtropical seas are smaller and rarely exceed 30 centimetres (12 in) in mantle length.[4] The common cuttlefish is native to at least the Mediterranean Sea, North Sea, and Baltic Sea, although subspecies have been proposed as far south as South Africa. It lives on sand and mud seabeds and it can tolerate brackish water conditions.[5][6] ",
    images: [
        "https://upload.wikimedia.org/wikipedia/commons/6/65/Sepia_com%C3%BAn_%28Sepia_officinalis%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_62.jpg",
    ]
}