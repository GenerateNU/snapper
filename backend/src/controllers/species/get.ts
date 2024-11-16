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

export const searchSpecies = async (req: express.Request, res:express.Response) => {
  console.log(JSON.stringify(req.params))
  const searchQuery: string = req.params.searchRequest;
  let results;
  if(searchQuery == "*"){
    results = await Species.find().limit(50)
  } else {
    results = await Species.find( { $text: { $search: searchQuery } },{ score: { $meta: "textScore" } }).limit(50).sort({score: { $meta: "textScore" }});
  }
  return res.status(200).json(results);
}
