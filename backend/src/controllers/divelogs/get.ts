import { Request, Response } from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import {
  DiveLogService,
  DiveLogServiceImpl,
} from '../../services/divelogService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';

const userService: UserService = new UserServiceImpl();
const divelogService: DiveLogService = new DiveLogServiceImpl();

export const getAllDiveLogsSortedPaginated = async (
  req: Request,
  res: Response,
) => {
  const { lat, lng } = req.query;
  const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
  const filter: string = (req.query.filter as string) || '';

  const filterValues = filter ? filter.split(',') : [];

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: 'Latitude and longitude are required' });
  }

  if (!req.session.userId) {
    return res.status(401);
  }

  const user = await userService.getUserBySupabaseId(req.session.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    const divelogs = await divelogService.getNearbyDivelogs({
      lng: lng as string,
      lat: lat as string,
      userId: user._id.toString(),
      page: page,
      limit: limit,
      filterValues: filterValues,
    });
    res.status(200).json(divelogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dive logs', error });
  }
};
