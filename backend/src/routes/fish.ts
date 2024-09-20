import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { getById } from '../controllers/fish/get';

export default (router : express.Router) => {
    router.get("/fish/:id", isAuthenticated, getById)
}