import express from 'express';
import { Fish } from '../../models/fish';

export const getById = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const fish = await Fish.findById(id);
  if (!fish) return res.status(404).json({ message: 'Fish not found' });
  return res.status(200).json(fish);
};