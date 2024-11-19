import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';
import divelog from './divelog';
import swagger from './swagger';
import user from './user';
import species from './species';

const router = express.Router();
export default (): express.Router => {
  authentification(router);
  healthcheck(router);
  divelog(router);
  user(router);
  species(router);
  swagger(router);
  return router;
};
