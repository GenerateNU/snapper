import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { NotFoundError } from '../../consts/errors';

const userService: UserService = new UserServiceImpl();

//Will get the user by the given ID
export const getUserSpeciesById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    if (!userId) {
      return res
        .status(400)
        .json({ error: 'User is not present in the current session!' });
    }

    const speciesCollected = await userService.getSpecies(userId, limit, page);

    //Return the OK status
    return res.status(200).json({
      species: speciesCollected,
      message: 'Successfully found species for user',
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({
      error: "Internal server error while searching for the user's species.",
    });
  }
};
