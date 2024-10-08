import express from 'express';
import { findUserBySupabaseId } from '../../services/userService';

//Will get the user by the given ID
export const getUserByID = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    //Get the ID from the body of the request
    const id  = req.session.userId;

    //Check to make sure that the id is defined
    if (!id) {
      //Error if not
      return res.status(400).json({ error: 'ID is a required argument' });
    }

    //Query the given ID on the database and save the result
    const foundUser = await findUserBySupabaseId(id);

    //Ensure that there is a defined(non-null) result
    if (!foundUser) {
      //Error if not
      return res
        .status(400)
        .json({ error: 'Unable to find user of ID: ' + id });
    }

    //Return the OK status
    return res
      .status(200)
      .json({
        user: foundUser,
        message:
          'Successfully found the user ID:' + id,
      });
  } catch (err) {
    //Handle error
    console.error('Error while searching for user ID', err);
    return res
      .status(500)
      .json({ error: 'Internal server error while searching for user ID.' });
  }
};
