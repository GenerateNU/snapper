import express from 'express';
import { Species } from '../../models/species';

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

export const querySpecies = async (req: express.Request, res: express.Response) => {
  const query = req.query.q ? req.query.q.toString().trim() : '';

  try {
    let species;
    if (query) {
      species = await Species.find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } }) // Sort by relevance
        .limit(5); // Limit to 5 results
    } else {
      // Default: Get the top 5 species sorted alphabetically by scientificName
      species = await Species.find({})
        .sort({ scientificName: 1 })
        .limit(5);
    }
    return res.status(200).json(species);
  } catch (error) {
    console.error('Error querying species:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
