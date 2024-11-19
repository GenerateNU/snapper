import express from 'express';
import { Fish } from '../../models/fish';

export const getById = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const fish = await Fish.findById(id);
  if (!fish) return res.status(404).json({ message: 'Fish not found' });
  return res.status(200).json(fish);
};

export const queryFish = async (req: express.Request, res: express.Response) => {
  const query = req.query.q ? req.query.q.toString().trim() : '';
  try {
    let fish;
    if (query) {
      fish = await Fish.find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(5);
    } else {
      // Default: Get the top 5 fish sorted alphabetically
      fish = await Fish.find({})
        .sort({ commonName: 1 })
        .limit(5);
    }
    return res.status(200).json(fish);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


