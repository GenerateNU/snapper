import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';
import { NotFoundError } from '../../consts/errors';
import { ObjectId } from 'mongodb';

const userService: UserService = new UserServiceImpl();

export const getFollowingPosts = async (
  req: express.Request,
  res: express.Response,
) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
  const filter: string = (req.query.filter as string) || '';

  const filterValues = filter ? filter.split(',') : [];

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const followingDiveLogs = await userService.getFollowingPosts(
      userId,
      limit,
      page,
      filterValues,
    );
    return res.status(200).json(followingDiveLogs);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred while retrieving divelogs' });
  }
};
