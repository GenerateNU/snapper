import express from 'express';
import { register } from '../controllers/authentification';

export default (router: express.Router) => {
    router.post('/auth/register', register);
};
