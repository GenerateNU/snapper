import express from 'express';
import { Species } from '../../models/species';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';

export const getById = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const species = await Species.findById(id);
  if (!species) return res.status(404).json({ message: 'Species not found' });
  return res.status(200).json(species);
};

export const getByScientificName = async (
  req: express.Request,
  res: express.Response,
) => {
  const scientificName = req.params.scientificName;
  const species = await Species.findOne({ scientificName: scientificName });
  if (!species) return res.status(404).json({ message: 'Species not found' });
  return res.status(200).json(species);
};

export const searchSpecies = async (
  req: express.Request,
  res: express.Response,
) => {
  const searchQuery: string = req.params.searchRequest;
  try {
    let results;
    if (searchQuery && searchQuery === '*') {
      results = await Species.find({}).sort({ scientificName: 1 }).limit(50);
    } else if (searchQuery) {
      results = await Species.find({ $text: { $search: searchQuery } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(50);
    }
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error searching for species', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchAndPaginatedSpecies = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { text = '', page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    const pageSize = parseInt(page as string);
    const limitSize = parseInt(limit as string);

    if (pageSize < 1 || limitSize < 1) {
      return res.status(400).json({
        error:
          'Invalid pagination parameters. Page and limit must be positive numbers.',
      });
    }

    const skip = (pageSize - 1) * limitSize;

    const query = [
      {
        $search: {
          index: 'commonNames',
          autocomplete: {
            query: text,
            path: 'commonNames',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              maxExpansions: 50,
            },
          },
        },
      },
      { $skip: skip },
      { $limit: limitSize },
    ];

    const results = await Species.aggregate(query);

    return res.status(200).json({
      page: pageSize,
      limit: limitSize,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'An error occurred while fetching users.',
    });
  }
};
