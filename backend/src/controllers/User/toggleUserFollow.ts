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
    const currentUserId = req.session.userId; // supabaseId
    const targetUserId = req.params.userid; // mongoId
    console.log(currentUserId);
    console.log(targetUserId);

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
    if (!currentUserInMongoDB) {
      return res.status(404).json({ error: 'Current user not found.' });
    }

    // Assuming targetUserId is a MongoDB ObjectId, convert it if necessary
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: 'Invalid target user ID format.' });
    }

    // Fetch the target user using the MongoDB ObjectId
    const targetUser = await userService.getUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found.' });
    }

    // Use the current user's MongoDB ID
    const currentUserMongoDBId = currentUserInMongoDB._id.toString();
    console.log(currentUserMongoDBId);

    // Check if the current user is already following the target user
    const alreadyFollowing = await userService.isFollowingUser(
      currentUserMongoDBId,
      targetUserId,
    );
    if (alreadyFollowing) {
      await userService.unfollowUser(currentUserMongoDBId, targetUserId);
      return res
        .status(200)
        .json({ message: 'Successfully unfollowed the user.' });
    } else {
      await userService.followUser(currentUserMongoDBId, targetUserId);
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
