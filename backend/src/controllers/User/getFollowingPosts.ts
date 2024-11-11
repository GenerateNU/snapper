import express from 'express';
import {
  findUserBySupabaseId,
  UserService,
  UserServiceImpl,
} from '../../services/userService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';

const userService: UserService = new UserServiceImpl();

export const getFollowingPosts = async (
  req: express.Request,
  res: express.Response,
) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;

  if (!userId) {
    return res.status(400).json({ message: 'User Id is required' });
  }

  const user = await findUserBySupabaseId(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userMongoDBId = user._id.toString();

  try {
    const followingDiveLogs = await userService.getFollowingPosts(
      userMongoDBId,
      limit,
      page,
    );
    return res.status(200).json(followingDiveLogs);
  } catch (e: any) {
    return res
      .status(500)
      .json({ error: 'An error occurred while retrieving divelogs: ' + e });
  }
};
