import express from 'express';
import { Species } from '../../models/species';

export const getByScientificName = async (req: express.Request, res: express.Response) => {
    const scientificName = req.params.scientificName;
    const fish = await Species.find({ scientificName: scientificName });
    if (!fish) return res.status(404).json({ message: 'Species not found' });
    return res.status(200).json(fish);
};