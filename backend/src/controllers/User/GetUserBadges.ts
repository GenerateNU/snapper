import express from 'express';
import { findUserBySupabaseId } from '../../services/userService';

export const getUserBadges = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userID = req.session.userId;

    if (!userID) {
      return res.status(400).json({ error: 'ID is a required argument' });
    }

    const foundUser = await findUserBySupabaseId(userID);

    if (!foundUser) {
      return res
        .status(400)
        .json({ error: 'Unable to find user of ID: ' + userID });
    }

    return res.status(200).json({
      badges: foundUser.badges,
      message: 'Successfully found badges for user:' + userID,
    });
  } catch (err) {
    console.error("Error while searching for User's badges:\n", err);
    return res.status(500).json({
      error:
        "Internal server error while searching for the user's badges.\n" + err,
    });
  }
};
