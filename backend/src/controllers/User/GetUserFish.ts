import express from 'express';
import { findUserBySupabaseId } from '../../services/userService';
import { UserService, UserServiceImpl } from '../../services/userService';

const userService: UserService = new UserServiceImpl();

//Will get the user by the given ID
export const getUserFishById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userID = req.params.id;

    //Check to make sure that the id is defined
    if (!userID) {
      return res
        .status(400)
        .json({ error: 'User is not present in the current session!' });
    }

    const foundUser = await findUserBySupabaseId(userID);

    //Ensure that there is a defined(non-null) result
    if (!foundUser) {
      //Error if not
      return res
        .status(400)
        .json({ error: 'Unable to find user of ID: ' + userID });
    }

    const fishCollected = await userService.getFish(foundUser._id.toString());

    //Return the OK status
    return res.status(200).json({
      fish: fishCollected,
      message: 'Successfully found fish for user:' + userID,
    });
  } catch (err) {
    //Handle error
    console.error("Error while searching for User's fish:\n", err);
    return res.status(500).json({
      error:
        "Internal server error while searching for the user's fish.' + err",
    });
  }
};
