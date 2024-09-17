import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';
import divelog from './divelog';

const router = express.Router();
export default (): express.Router => {
  authentification(router);
  healthcheck(router);
  divelog(router);
  return router;
};
