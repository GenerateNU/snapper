import mongoose from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../consts/pagination';
import { DiveLog } from '../models/diveLog';
import { UserModel } from '../models/users';
import { Document } from 'mongodb';
import { NotFoundError } from '../consts/errors';

export interface UserService {
  getUserById(id: string): Promise<Document | null>;
  getUserBySupabaseId(id: string): Promise<Document | null>;
  editUserBySupabaseId(
    supabaseId: string,
    updatedJson: Record<string, any>,
  ): Promise<Document | null>;
  createUser(userData: {
    email: string;
    username: string;
    supabaseId: string;
    firstName: string;
    lastName: string;
  }): Promise<Document | null>;
  getSpecies(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;
  getDiveLogs(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;
  getFollowingPosts(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;
  updateDeviceToken(
    userId: string,
    deviceToken: string,
  ): Promise<Document | null>;
  toggleFollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null>;
}

export class UserServiceImpl implements UserService {
  async getUserById(id: string): Promise<Document | null> {
    return UserModel.findById(id);
  }

  async createUser(userData: {
    email: string;
    username: string;
    supabaseId: string;
    firstName: string;
    lastName: string;
  }) {
    const user = new UserModel(userData);
    return user.save();
  }

  async getUserBySupabaseId(supabaseId: string) {
    return UserModel.findOne({ supabaseId });
  }

  async editUserBySupabaseId(
    supabaseId: string,
    updatedJson: Record<string, any>,
  ) {
    return UserModel.updateOne({ supabaseId }, { $set: updatedJson });
  }

  async toggleFollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null> {
    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError('Target user not found');
    }

    const isFollowing = targetUser.followers.includes(
      new mongoose.Types.ObjectId(currentUserId),
    );

    const updateCurrentUser = isFollowing
      ? { $pull: { following: targetUserId } }
      : { $addToSet: { following: targetUserId } };

    const updateTargetUser = isFollowing
      ? { $pull: { followers: currentUserId } }
      : { $addToSet: { followers: currentUserId } };

    const followUser = await UserModel.findByIdAndUpdate(
      currentUserId,
      updateCurrentUser,
      { new: true },
    );

    await UserModel.findByIdAndUpdate(targetUserId, updateTargetUser, {
      new: true,
    });

    return followUser;
  }

  async getSpecies(
    userId: string,
    limit: number = DEFAULT_LIMIT,
    page: number = DEFAULT_PAGE,
  ): Promise<Document[] | null> {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'speciesCollected',
        options: {
          sort: { createdAt: -1 },
          limit: limit,
          skip: (page - 1) * limit,
        },
      })
      .exec();

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user?.speciesCollected || null;
  }

  async getDiveLogs(
    userId: string,
    limit: number = DEFAULT_LIMIT,
    page: number = DEFAULT_PAGE,
  ): Promise<Document[]> {
    const calculatedSkip = (page - 1) * limit;
    const user = await UserModel.findById(userId)
      .populate({
        path: 'diveLogs',
        options: {
          sort: { createdAt: -1 },
          limit: limit,
          skip: calculatedSkip,
        },
        populate: {
          path: 'speciesTags',
          select: 'commonNames scientificName',
        },
      })
      .exec();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user?.diveLogs || null;
  }

  async updateDeviceToken(
    userId: string,
    deviceToken: string,
  ): Promise<Document | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await UserModel.findByIdAndUpdate(
        { userId },
        [
          {
            $set: {
              deviceTokens: {
                $cond: {
                  if: { $in: [deviceToken, '$deviceTokens'] },
                  then: {
                    $filter: {
                      input: '$deviceTokens',
                      cond: { $ne: ['$$this', deviceToken] },
                    },
                  },
                  else: { $concatArrays: ['$deviceTokens', [deviceToken]] },
                },
              },
            },
          },
        ],
        { new: true },
      );

      if (!user) {
        session.abortTransaction();
        throw new NotFoundError('User not found');
      }

      await session.commitTransaction();
      return user;
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getFollowingPosts(
    userId: string,
    limit: number = 10,
    page: number = 1,
  ): Promise<Document[] | null> {
    const user = await UserModel.findById({ userId }, 'following');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const divelogs = await DiveLog.find({
      user: {
        $in: user.following,
      },
    })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return divelogs;
  }
}
