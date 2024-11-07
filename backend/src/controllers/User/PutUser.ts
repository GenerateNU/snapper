import express from 'express';
import {
  editUserBySupabaseId,
  findUserBySupabaseId,
} from '../../services/userService';
import { UserModel } from '../../models/users';

//Will get the user by the given ID
export const PutUser = async (req: express.Request, res: express.Response) => {
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
      'name'
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

    //Query the given ID on the database and save the result
    const foundUser = await findUserBySupabaseId(userId);

    //Ensure that there is a defined(non-null) result
    if (!foundUser) {
      //Error if not
      return res
        .status(400)
        .json({ error: 'Unable to find user of ID: ' + userId });
    }

    //Should mutate the id with the given request
    const user = await editUserBySupabaseId(userId, req.body);
    //Return the OK status
    return res.status(200).json({
      message: 'Successfully updated user:' + userId,
    });
  } catch (err) {
    //Handle error
    console.error('Error updating the user data:\n', err);
    return res.status(500).json({
      error: 'Internal server error while updating user data.\n' + err,
    });
  }
};
