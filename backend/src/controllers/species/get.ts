import express from 'express';
import { Species } from '../../models/species';
import Fuse from 'fuse.js';

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
  const allSpecies = await Species.find();
  console.log(allSpecies.length);
  //More options can be added later
  //https://www.fusejs.io/api/options.html
  const fuse = new Fuse(allSpecies, {
    isCaseSensitive: false,
    keys: ['commonNames'],
  });

  const searchQuery: string = req.params.searchRequest;
  let results;
  if (searchQuery == '*') {
    results = allSpecies.slice(0, 50);
  } else {
    results = fuse
      .search(searchQuery)
      .slice(0, 50)
      .map((element) => element.item);
  }
  return res.status(200).json(results);
};