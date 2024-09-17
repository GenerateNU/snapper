import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';
import divelog from './divelog';
import user from './user';

const router = express.Router();
export default (): express.Router => {
  authentification(router);
  healthcheck(router);
  divelog(router);
  user(router);
  return router;
};
