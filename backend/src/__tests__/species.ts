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
const speciesFindQueryMock = Species.find as jest.Mock;

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
}
);

describe('GET /species/query', () => {
  beforeEach(() => {
    speciesFindQueryMock.mockReset();
  });

  it('Returns species results for a valid query string', async () => {
    const queryString = 'salmon';
    const mockResults = [
      { _id: new mongoose.Types.ObjectId().toString(), scientificName: 'Salmo salar', commonNames: ['Atlantic salmon'] },
      { _id: new mongoose.Types.ObjectId().toString(), scientificName: 'Oncorhynchus tshawytscha', commonNames: ['Chinook salmon'] },
    ];

    speciesFindQueryMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockResults),
      }),
    });

    const res = await request(app).get(`/species/query?q=${queryString}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResults);
  });

  it('Returns top alphabetically sorted species when no query is provided', async () => {
    const mockResults = [
      { _id: new mongoose.Types.ObjectId().toString(), scientificName: 'Abramis brama', commonNames: ['Bream'] },
      { _id: new mongoose.Types.ObjectId().toString(), scientificName: 'Alosa alosa', commonNames: ['Allis shad'] },
    ];

    speciesFindQueryMock.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockResults),
      }),
    });

    const res = await request(app).get('/species/query');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockResults);
  });

  it('Handles internal server errors gracefully', async () => {
    speciesFindQueryMock.mockImplementation(() => {
      throw new Error('Database error');
    });

    const res = await request(app).get('/species/query?q=salmon');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error' });
  });
});
