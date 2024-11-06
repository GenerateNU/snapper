import express from 'express';
import { Species } from '../../models/species';

export const getById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const fish = await Species.findById(id);
    if (!fish) return res.status(404).json({ message: 'Species not found' });
    return res.status(200).json(fish);
};