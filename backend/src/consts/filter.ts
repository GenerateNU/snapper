export interface TaxonomyFilter {
  [key: string]: { [taxonomyField: string]: string[] };
}

export const TAXONOMY_FILTER_MAP: TaxonomyFilter = {
  shark: {
    order: [
      'Q48178',
      'Q133317',
      'Q224470',
      'Q260031',
      'Q503667',
      'Q465575',
      'Q15207720',
      'Q17280209',
    ],
  },
  eel: {
    order: ['Q128685'],
  },
  ray: {
    order: ['Q796580', 'Q41317'],
  },
  seahorse: {
    genus: ['Q74363'],
  },
  jellyfish: {
    class: ['Q272388'],
  },
  octopus: {
    order: ['Q40152'],
  },
  coral: {
    order: ['Q195605'],
  },
};
