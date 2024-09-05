import { z } from 'zod';
import { UserModel } from '../models/users';

const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
});

type UserType = z.infer<typeof userSchema>;

export const createUser = async (values: UserType) => {
  const validationResult = userSchema.safeParse(values);

  if (!validationResult.success) {
    throw new Error('Invalid user data');
  }

  const user = new UserModel(validationResult.data);
  await user.save();
  return user.toObject();
};

// Get user by email
export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email }).lean().exec();
};
