import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';

const userService: UserService = new UserServiceImpl();

export const getMyDiveLogs = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    //Get the ID from the body of the request
    const userID = req.session.userId;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    //Check to make sure that the id is defined
    if (!userID) {
      return res.status(400).json({ error: 'ID is a required argument' });
    }

    //Query the given ID on the database and save the result
    const foundUser = await userService.getUserBySupabaseId(userID);

    //Ensure that there is a defined(non-null) result
    if (!foundUser) {
      //Error if not
      return res
        .status(400)
        .json({ error: 'Unable to find user of ID: ' + userID });
    }

    const divelogs = await userService.getDiveLogs(
      foundUser._id.toString(),
      limit,
      page,
    );

    //Return the OK status
    return res.status(200).json({
      divelogs: divelogs,
      message: 'Successfully found dive logs for user:' + userID,
    });
  } catch (err) {
    //Handle error
    console.error("Error while searching for User's dive logs:\n", err);
    return res.status(500).json({
      error:
        "Internal server error while searching for the user's dive logs.\n" +
        err,
    });
  }
};
