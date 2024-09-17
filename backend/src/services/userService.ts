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


export interface UserService {
  getUserById(id: string): Promise<Document | null>;
}

export class UserServiceImpl implements UserService {
  async getUserById(id: string): Promise<Document | null> {
      return UserModel.findById(id).exec();
  }
}