import express from 'express';
import { register } from '../controllers/authentification/register';
import { login } from '../controllers/authentification/login';
import { logout } from '../controllers/authentification/logout';
import {
  getSession,
  refreshSession,
} from '../controllers/authentification/session';

export default (router: express.Router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
  router.post('/auth/logout', logout);
  router.get('/auth/session', getSession);
  router.post('/auth/refresh-session', refreshSession);
};
