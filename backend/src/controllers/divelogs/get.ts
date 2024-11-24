import { Request, Response } from 'express';
import { DiveLog } from '../../models/diveLog';

export const getAllDiveLogsSortedPaginated = async (
  req: Request,
  res: Response,
) => {
  const { lat, lng, page = 1, limit = 10 } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: 'Latitude and longitude are required' });
  }

  const pageNumber = parseInt(page as string);
  const pageSize = parseInt(limit as string);

  try {
    const diveLogs = await DiveLog.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $addFields: {
          'user.profilePicture': '$userDetails.profilePicture',
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);

    res.status(200).json(diveLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dive logs', error });
  }
};
