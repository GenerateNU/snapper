import { Request, Response } from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import {
  DiveLogService,
  DiveLogServiceImpl,
} from '../../services/divelogService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';
import { DiveLog } from '../../models/diveLog';
import { UserModel } from '../../models/users';

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

export const searchDivelogsPaginated = async (req: Request, res: Response) => {
  try {
    const { text = '', page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = req.query;
    const pageSize = parseInt(page as string);
    const limitSize = parseInt(limit as string);

    if (pageSize < 1 || limitSize < 1) {
      return res.status(400).json({
        error:
          'Invalid pagination parameters. Page and limit must be positive numbers.',
      });
    }

    const skip = (pageSize - 1) * limitSize;

    const query = [
      {
        $search: {
          index: 'description',
          compound: {
            should: [
              {
                text: {
                  query: text,
                  path: 'description',
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3,
                  },
                  score: {
                    boost: { value: 3 },
                  },
                },
              },
              {
                autocomplete: {
                  query: text,
                  path: 'description',
                  fuzzy: {
                    maxEdits: 2,
                  },
                  score: {
                    boost: { value: 5 },
                  },
                },
              },
            ],
          },
        },
      },
      { $skip: skip },
      { $limit: limitSize },
    ];

    const results = await DiveLog.aggregate(query);

    if (results.length > 0) {
      const user = async (id: string) => await UserModel.findById(id);
      const more = results.map(async (divelog) => {
        const u = await user(divelog.user as string);
        const profilePhoto = u?.profilePicture;
        return { profilePhoto, ...divelog };
      });
      const moreResults = await Promise.all(more);
      return res.status(200).json({
        page: pageSize,
        limit: limitSize,
        moreResults,
      });
    }

    return res.status(200).json({
      page: pageSize,
      limit: limitSize,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'An error occurred while fetching users.',
    });
  }
};
