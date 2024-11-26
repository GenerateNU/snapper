import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware';
import getUsersPaginated from '../controllers/users/getUsers';

export default (router : express.Router) => {
     router.get("/users", isAuthenticated, getUsersPaginated);
}