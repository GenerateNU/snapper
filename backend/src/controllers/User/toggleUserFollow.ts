import { findUserBySupabaseId } from './../../services/userService';
import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import mongoose from 'mongoose'; // Import mongoose to use ObjectId

const userService: UserService = new UserServiceImpl();

export const toggleUserFollow = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const currentUserId = req.session.userId;
    const targetUserId = req.params.userid;

    // Check if the user is logged in
    if (!currentUserId) {
      return res
        .status(400)
        .json({ error: 'User must be logged in to follow others.' });
    }

    // Check if the target user ID is provided
    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required.' });
    }

    // Fetch the current user from MongoDB using their Supabase ID
    const currentUserInMongoDB = await findUserBySupabaseId(currentUserId);
    const targetUserInMongoDB = await findUserBySupabaseId(targetUserId);

    if (!currentUserInMongoDB) {
      return res.status(404).json({ error: 'Current user not found.' });
    }

    if (!targetUserInMongoDB) {
      return res.status(404).json({ error: 'Target user not found.' });
    }

    const currentUserMongoDBId = currentUserInMongoDB._id.toString();
    const targetUserMongoDBId = targetUserInMongoDB._id.toString();
    
    const alreadyFollowing = await userService.isFollowingUser(
      currentUserMongoDBId,
      targetUserMongoDBId,
    );
    if (alreadyFollowing) {
      await userService.unfollowUser(currentUserMongoDBId, targetUserMongoDBId);
      return res
        .status(200)
        .json({ message: 'Successfully unfollowed the user.' });
    } else {
      await userService.followUser(currentUserMongoDBId, targetUserMongoDBId);
      return res
        .status(200)
        .json({ message: 'Successfully followed the user.' });
    }
  } catch (error) {
    console.error('Error toggling follow status:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while toggling follow status.' });
  }
};
