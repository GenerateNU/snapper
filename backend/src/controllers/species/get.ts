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
