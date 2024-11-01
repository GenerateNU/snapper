import { FishService, FishServiceImpl } from './../../services/fishService';
import express, { Request, Response } from 'express';
import { Fish } from '../../models/fish';

const fishService = new FishServiceImpl();

export const createFish = async (req: Request, res: Response) => {
  const { commonName } = req.body;

  if (!commonName) {
    return res.status(400).json({
      error: 'Name is required.',
    });
  }

  try {
    const savedFish = await fishService.createFish(req.body);

    return res.status(201).json({
      message: 'Fish created successfully!',
      fish: savedFish,
    });
  } catch (error) {
    console.error('Error creating fish:', error);
    return res.status(500).json({
      error: 'An error occurred while creating the fish.',
    });
  }
};
