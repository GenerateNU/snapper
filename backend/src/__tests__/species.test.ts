jest.mock('../middlewares/authMiddleware', () => ({
  isAuthenticated: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return next();
  },
}));
import { Species } from '../models/species';
import request from 'supertest';
import express from 'express';
import species from '../routes/species';
import mongoose from 'mongoose';

jest.mock('../models/species');

const app = express();
const router = express.Router();
species(router);

app.use(router);
const speciesMock = Species.findById as jest.Mock;
const speciesFindMock = Species.findOne as jest.Mock;

describe('GET /species/id', () => {
  beforeEach(() => {
    speciesMock.mockReset();
  });

  it('No species with this id', async () => {
    const randomObjectId = new mongoose.Types.ObjectId().toString();
    const query = `/species/${randomObjectId}`;
    const res = await request(app).get(query);
    expect(res.status).toBe(404);
  });

  it('Gets a specific species id', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const species = { _id: id, scientificName: 'Scorpaena brachion' };
    speciesMock.mockResolvedValue(species);
    const res = await request(app).get(`/species/id/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(species);
  });
});

describe('GET /species/scientific/id', () => {
  beforeEach(() => {
    speciesFindMock.mockReset();
  });

  it('No species with this scientific name', async () => {
    const query = `/species/scientific/doesntexist"`;
    const res = await request(app).get(query);
    expect(res.status).toBe(404);
  });

  it('Gets a specific species by scientific name', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const scientificName = 'Scorpaena brachion';
    const species = { _id: id, scientificName: scientificName };
    speciesFindMock.mockResolvedValue(species);
    const res = await request(app).get(`/species/scientific/${scientificName}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(species);
  });
});
