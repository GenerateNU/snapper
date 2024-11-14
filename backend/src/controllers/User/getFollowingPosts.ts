import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';
import { NotFoundError } from '../../consts/errors';

const userService: UserService = new UserServiceImpl();

export const getFollowingPosts = async (
  req: express.Request,
  res: express.Response,
) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const followingDiveLogs = await userService.getFollowingPosts(
      userId,
      limit,
      page,
    );
    return res.status(200).json(followingDiveLogs);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: 'An error occurred while retrieving divelogs' });
  }
};
