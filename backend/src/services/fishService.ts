import { Fish } from '../models/fish';
import { Document } from 'mongoose';

export interface FishService {
  createFish(data: Partial<Document>): Promise<Document>;
}

export class FishServiceImpl implements FishService {
  async createFish(data: Partial<Document>): Promise<Document> {
    const fish = await Fish.create(data);
    return fish;
  }
}
