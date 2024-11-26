import express from 'express';
import { UserModel } from '../../models/users';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';

export default async function getUsersPaginated(
  req: express.Request,
  res: express.Response,
) {
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
          index: 'username',
          compound: {
            should: [
              {
                text: {
                  query: text,
                  path: 'username',
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
                  path: 'username',
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

    const results = await UserModel.aggregate(query);

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
}
