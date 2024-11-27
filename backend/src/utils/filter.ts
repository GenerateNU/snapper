import { TAXONOMY_FILTER_MAP } from '../consts/filter';

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

  return result;
};
