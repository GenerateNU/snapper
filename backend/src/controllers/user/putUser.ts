import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { NotFoundError } from '../../consts/errors';
const userService: UserService = new UserServiceImpl();

//Will get the user by the given ID
export const putUser = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ error: 'User is not present in the current session!' });
    }
    const userFields = [
      'username',
      'email',
      'supabaseId',
      'badges',
      'diveLogs',
      'speciesCollected',
      'followers',
      'following',
      'profilePicture',
      'deviceTokens',
      'firstName',
      'lastName',
    ];

    //TODO: Will not change with schema
    //Check if each field is already present in the schema
    for (const key in req.body) {
      if (!userFields.includes(key)) {
        res
          .status(400)
          .json({ error: 'That field does not exist in the schema!' });
      }
    }

    //Should mutate the id with the given request
    await userService.editUserBySupabaseId(userId, req.body);

    //Return the OK status
    return res.status(200).json({
      message: 'Successfully updated user:' + userId,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({
      error: 'Internal server error while updating user data.\n' + err,
    });
  }
};
