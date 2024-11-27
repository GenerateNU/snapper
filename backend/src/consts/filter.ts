export interface TaxonomyFilter {
  [key: string]: { [taxonomyField: string]: string[] };
}

const TAXONOMY_FILTER_MAP: TaxonomyFilter = {
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

/**
 * Get taxonomy arrays for order, class, and family from filters.
 * @param filterValues Array of filter strings like ["shark", "jellyfish"]
 * @returns Object with arrays for order, class, and family
 */
export const getTaxonomyArrays = (filterValues: string[]) => {
  const result: any = { order: [], class: [], family: [] };

  filterValues.map((filter) => {
    const taxonomy = TAXONOMY_FILTER_MAP[filter.toLowerCase()];

    if (taxonomy) {
      Object.entries(taxonomy).forEach(([taxonomyField, values]) => {
        if (result[taxonomyField]) {
          result[taxonomyField].push(...values);
        }
      });
    }
  });

  console.log(result);

  return result;
};
