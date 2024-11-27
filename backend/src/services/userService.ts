import mongoose from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../consts/pagination';
import { DiveLog } from '../models/diveLog';
import { UserModel } from '../models/users';
import { Document } from 'mongodb';
import { NotFoundError } from '../consts/errors';
import { getTaxonomyArrays } from '../utils/filter';

export interface UserService {
  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user.
   * @returns A promise that resolves to the user document or null if not found.
   */
  getUserById(id: string): Promise<Document | null>;

  /**
   * Retrieves a user by their Supabase ID.
   * @param id - The Supabase ID of the user.
   * @returns A promise that resolves to the user document or null if not found.
   */
  getUserBySupabaseId(id: string): Promise<Document | null>;

  /**
   * Edits a user by their Supabase ID.
   * @param supabaseId - The Supabase ID of the user.
   * @param updatedJson - The updated user data as a JSON object.
   * @returns A promise that resolves to the updated user document or null if not found.
   */
  editUserBySupabaseId(
    supabaseId: string,
    updatedJson: Record<string, any>,
  ): Promise<Document | null>;

  /**
   * Creates a new user.
   * @param userData - An object containing the user's data.
   * @param userData.email - The email of the user.
   * @param userData.username - The username of the user.
   * @param userData.supabaseId - The Supabase ID of the user.
   * @param userData.firstName - The first name of the user.
   * @param userData.lastName - The last name of the user.
   * @returns A promise that resolves to the created user document or null if creation fails.
   */
  createUser(userData: {
    email: string;
    username: string;
    supabaseId: string;
    firstName: string;
    lastName: string;
  }): Promise<Document | null>;

  /**
   * Retrieves a list of species associated with a user.
   * @param userId - The ID of the user.
   * @param limit - The maximum number of species to retrieve.
   * @param page - The page number for pagination.
   * @returns A promise that resolves to an array of species documents or null if not found.
   */
  getSpecies(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;

  /**
   * Retrieves a list of dive logs associated with a user.
   * @param userId - The ID of the user.
   * @param limit - The maximum number of dive logs to retrieve.
   * @param page - The page number for pagination.
   * @returns A promise that resolves to an array of dive log documents or null if not found.
   */
  getDiveLogs(
    userId: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;

  /**
   * Retrieves a list of posts from users that the specified user is following.
   * @param userId - The ID of the user.
   * @param limit - The maximum number of posts to retrieve.
   * @param page - The page number for pagination.
   * @param filterValues - Arrays of string for filtering.
   * @returns A promise that resolves to an array of post documents or null if not found.
   */
  getFollowingPosts(
    userId: string,
    limit: number,
    page: number,
    filterValues: string[],
  ): Promise<Document[] | null>;

  /**
   * Updates the expo device token for a user. Remove it if it already exists. Add it if it has not existed.
   * @param userId - The ID of the user.
   * @param deviceToken - The new device token.
   * @returns A promise that resolves to the updated user document or null if not found.
   */
  updateDeviceToken(
    userId: string,
    deviceToken: string,
  ): Promise<Document | null>;

  /**
   * Toggles the follow status between the current user and a target user.
   * @param currentUserId - The ID of the current user.
   * @param targetUserId - The ID of the target user.
   * @returns A promise that resolves to the updated follow status document or null if not found.
   */
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
    const user = await UserModel.updateOne(
      { supabaseId },
      { $set: updatedJson },
    );
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async toggleFollow(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const targetUser =
        await UserModel.findById(targetUserId).session(session);

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

      const [followUser, followedUser] = await Promise.all([
        UserModel.findByIdAndUpdate(currentUserId, updateCurrentUser, {
          new: true,
        }).session(session),
        UserModel.findByIdAndUpdate(targetUserId, updateTargetUser, {
          new: true,
        }).session(session),
      ]);

      if (!followUser || !followedUser) {
        throw new NotFoundError('One or both users were not found');
      }

      await session.commitTransaction();
      return followUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
          sort: { date: -1 },
          limit: limit,
          skip: calculatedSkip,
        },
        populate: [
          {
            path: 'speciesTags',
            select: 'commonNames scientificName',
          },
          {
            path: 'user',
            select: 'profilePicture',
          },
        ],
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
    const user = await UserModel.findByIdAndUpdate(
      userId,
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
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async getFollowingPosts(
    userId: string,
    limit: number = 10,
    page: number = 1,
    filterValues: string[],
  ): Promise<Document[] | null> {
    const user = await UserModel.findById(userId, 'following');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const taxonomyArrays = getTaxonomyArrays(filterValues);

    const matchStage: any = {
      $and: [{ user: { $in: user.following } }],
    };

    if (
      taxonomyArrays.order.length > 0 ||
      taxonomyArrays.class.length > 0 ||
      taxonomyArrays.family.length > 0
    ) {
      matchStage.$and.push({
        $or: [
          { 'speciesInfo.order': { $in: taxonomyArrays.order } },
          { 'speciesInfo.class': { $in: taxonomyArrays.class } },
          { 'speciesInfo.family': { $in: taxonomyArrays.family } },
        ],
      });
    }

    const diveLogs = await DiveLog.aggregate([
      {
        $lookup: {
          from: 'species',
          localField: 'speciesTags',
          foreignField: '_id',
          as: 'speciesInfo',
        },
      },
      {
        $match: {
          $and: [
            { user: { $in: user.following } },
            ...(taxonomyArrays.order.length > 0 ||
            taxonomyArrays.class.length > 0 ||
            taxonomyArrays.family.length > 0
              ? [
                  {
                    $or: [
                      { 'speciesInfo.order': { $in: taxonomyArrays.order } },
                      { 'speciesInfo.class': { $in: taxonomyArrays.class } },
                      { 'speciesInfo.family': { $in: taxonomyArrays.family } },
                    ],
                  },
                ]
              : []),
          ],
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $sort: { date: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 1,
          date: 1,
          location: 1,
          photos: 1,
          description: 1,
          likes: 1,
          speciesTags: '$speciesInfo',
          user: {
            _id: '$userInfo._id',
            username: '$userInfo.username',
            profilePicture: '$userInfo.profilePicture',
          },
        },
      },
    ]);

    return diveLogs;
  }
}
