import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../consts/pagination';

const userService: UserService = new UserServiceImpl();

//Will get the user by the given ID
export const getMySpecies = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    //Get the ID from the body of the request
    const userID = req.session.userId;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;

    //Check to make sure that the id is defined
    if (!userID) {
      return res
        .status(400)
        .json({ error: 'User is not present in the current session!' });
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

    const speciesCollected = await userService.getSpecies(
      foundUser._id.toString(),
      limit,
      page,
    );

    //Return the OK status
    return res.status(200).json({
      species: speciesCollected,
      message: 'Successfully found species for user:' + userID,
    });
  } catch (err) {
    //Handle error
    console.error("Error while searching for User's species:\n", err);
    return res.status(500).json({
      error:
        "Internal server error while searching for the user's species.' + err",
    });
  }
};
