import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../consts/pagination';
import { DiveLog } from '../models/diveLog';
import { UserModel } from '../models/users';
import { Document } from 'mongodb';

export const createUser = async (userData: {
  email: string;
  username: string;
  supabaseId: string;
}) => {
  const user = new UserModel(userData);
  return user.save();
};

export const findUserBySupabaseId = async (supabaseId: string) => {
  return UserModel.findOne({ supabaseId });
};

export const editUserBySupabaseId = async (
  supabaseId: string,
  updatedJson: Record<string, any>,
) => {
  return UserModel.updateOne({ supabaseId }, { $set: updatedJson });
};

export interface UserService {
  getUserById(id: string): Promise<Document | null>;
  followUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null>;
  unfollowUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null>;
  isFollowingUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<boolean>;
  getSpecies(
    id: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;
  getDiveLogs(
    id: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;
  getFollowingPosts(
    id: string,
    limit: number,
    page: number,
  ): Promise<Document[] | null>;
  saveExpoToken(id: string, deviceToken: string): Promise<Document | null>;
  removeExpoToken(id: string, deviceToken: string): Promise<Document | null>;
  tokenAlreadyExists(id: string, deviceToken: string): Promise<boolean>;
}

export class UserServiceImpl implements UserService {
  async getUserById(id: string): Promise<Document | null> {
    return UserModel.findById(id);
  }

  async followUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null> {
    await UserModel.findByIdAndUpdate(
      currentUserId,
      // $addToSet ensures that targetUserId is added only if it is not already in the array
      { $addToSet: { following: targetUserId } }, // add targetUserId into following list of currentUser
      { new: true },
    );
    return UserModel.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: currentUserId } }, // add currentUserId to follower list of targetUser
      { new: true },
    );
  }

  async unfollowUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<Document | null> {
    await UserModel.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: targetUserId } }, // remove targetUserId into following list of currentUser
      { new: true },
    );
    return UserModel.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: currentUserId } }, // remove currentUserId to follower list of targetUser
      { new: true },
    );
  }

  async isFollowingUser(
    currentUserId: string,
    targetUserId: string,
  ): Promise<boolean> {
    const user = await UserModel.findOne({
      _id: currentUserId,
      following: targetUserId, // search in following array if it contains targetUserId
    });
    return !!user;
  }

  async getSpecies(
    id: string,
    limit: number = DEFAULT_LIMIT,
    page: number = DEFAULT_PAGE,
  ): Promise<Document[] | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;

    const species = await UserModel.findById(id)
      .populate({
        path: 'speciesCollected',
        options: {
          sort: { createdAt: -1 },
          limit: limit,
          skip: (page - 1) * limit,
        },
      })
      .exec();

    return species?.speciesCollected || null;
  }

  async getDiveLogs(
    userId: string,
    limit: number = DEFAULT_LIMIT,
    page: number = DEFAULT_PAGE,
  ): Promise<Document[] | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const calculatedSkip = (page - 1) * limit;
    const userWithDiveLogs = await UserModel.findById(userId)
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

    return userWithDiveLogs?.diveLogs || null;
  }

  async saveExpoToken(
    id: string,
    deviceToken: string,
  ): Promise<Document | null> {
    const user = await UserModel.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { deviceTokens: deviceToken } },
      { new: true },
    );
    return user;
  }

  async removeExpoToken(
    id: string,
    deviceToken: string,
  ): Promise<Document | null> {
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { deviceTokens: deviceToken } },
      { new: true },
    );
    return user;
  }

  async tokenAlreadyExists(id: string, deviceToken: string): Promise<boolean> {
    const user = await UserModel.findById(id);
    if (user) {
      return user.deviceTokens.includes(deviceToken);
    }
    return false;
  }

  async getFollowingPosts(
    id: string,
    limit: number = 10,
    page: number = 1,
  ): Promise<Document[] | null> {
    const user = await UserModel.findById(id);
    if (!user) {
      return null;
    }

    const followedUsers = user.following;

    const divelogs = await DiveLog.find({
      user: { $in: followedUsers },
    })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return divelogs;
  }
}
