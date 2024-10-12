import express from 'express';
import authentification from './authentification';
import healthcheck from './healthcheck';
import divelog from './divelog';
import swagger from './swagger';
import user from './user';
import fish from './fish';

const router = express.Router();
export default (): express.Router => {
  authentification(router);
  healthcheck(router);
  divelog(router);
  user(router);
  fish(router);
  swagger(router);
  return router;
};
