import { UserModel } from '../models/users';

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

