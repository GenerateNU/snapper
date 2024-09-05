import express from 'express';
import { createUser, getUserByEmail } from '../services/userService';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const user = await createUser({ email, username });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
