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

export const editUSerBySupabaseId = async (
  supabaseId: string,
  updatedJson: JSON,
) => {
  return UserModel.updateOne({ supabaseId }, { $set: { updatedJson } });
};

export interface UserService {
  getUserById(id: string): Promise<Document | null>;
  followUser(currentUserId: string, targetUserId: string): Promise<Document | null>;
  unfollowUser(currentUserId: string, targetUserId: string): Promise<Document | null>;
  isFollowingUser(currentUserId: string, targetUserId: string): Promise<boolean>;
}

export class UserServiceImpl implements UserService {
  async getUserById(id: string): Promise<Document | null> {
    return UserModel.findById(id);
  }

  async followUser(currentUserId: string, targetUserId: string): Promise<Document | null> {
    await UserModel.findByIdAndUpdate(
      currentUserId,
      // $addToSet ensures that targetUserId is added only if it is not already in the array
      { $addToSet: { following: targetUserId } }, // add targetUserId into following list of currentUser
      { new: true } 
    );
    return UserModel.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: currentUserId } }, // add currentUserId to follower list of targetUser
      { new: true }
    );
  }

  async unfollowUser(currentUserId: string, targetUserId: string): Promise<Document | null> {
    await UserModel.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: targetUserId } }, // remove targetUserId into following list of currentUser
      { new: true }
    );
    return UserModel.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: currentUserId } }, // remove currentUserId to follower list of targetUser
      { new: true }
    );
  }

  async isFollowingUser(currentUserId: string, targetUserId: string): Promise<boolean> {
    const user = await UserModel.findOne({
      _id: currentUserId,
      following: targetUserId, // search in following array if it contains targetUserId
    });
    return !!user;
  }
}

