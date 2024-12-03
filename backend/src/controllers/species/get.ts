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
