import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';
import { NotFoundError } from '../../consts/errors';
import { ObjectId } from 'mongodb';

const userService: UserService = new UserServiceImpl();

export const getUserDiveLogs = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;

    //Check to make sure that the id is defined
    if (!userId) {
      return res.status(400).json({ error: 'ID is a required argument' });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const divelogs = await userService.getDiveLogs(userId, limit, page);

    //Return the OK status
    return res.status(200).json({
      divelogs: divelogs,
      message: 'Successfully found dive logs for user',
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({
      error: "Internal server error while searching for the user's dive logs.",
    });
  }
};
