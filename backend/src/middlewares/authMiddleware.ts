import express from 'express';

export const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
