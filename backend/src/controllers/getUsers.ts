import { UserModel } from '../models/users';

export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
