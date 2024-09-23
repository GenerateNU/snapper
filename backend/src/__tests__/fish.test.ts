jest.mock('../middlewares/authMiddleware', () => ({
    isAuthenticated: (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        return next();
    },
}));
jest.mock('../models/fish')
import { Fish } from '../models/fish';
import request from 'supertest';
import express from 'express';
import fish from '../routes/fish';
import mongoose from 'mongoose';

Fish.aggregate = jest.fn();

const app = express();
const router = express.Router();
fish(router);
app.use(router);

describe("GET /Fish", () => {

    beforeEach(() => {
        (Fish.aggregate as jest.Mock).mockReset();
    });

    it('No fish with this id', async () => {
        const randomObjectId = new mongoose.Types.ObjectId().toString();
        const query = `/fish/${randomObjectId}`
        const res = await request(app).get(query);
        expect(res.status).toBe(404);
    });

    // it('Gets a specific fish id', async () => {
    //     const id = new mongoose.Types.ObjectId().toString();
    //     const fish = { _id : id,  commonName : "Stonefish"};
    //     const query = `/fish/${id}`
    //     const res = await request(app).get(query);
    //     expect(res.status).toBe(200);
    // })

})