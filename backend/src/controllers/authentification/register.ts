import express from 'express';
import { supabase } from '../../config/supabaseClient';
import { UserService, UserServiceImpl } from '../../services/userService';

const userService: UserService = new UserServiceImpl();

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({
        error:
          'First name, last name, email, password, and username are required.',
      });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('Supabase signUp error:', error.message);
      return res
        .status(400)
        .json({ error: 'Failed to register. Please try again later.' });
    }

    const user = data.user;
    if (!user) {
      console.error('User.ts creation failed: no user returned from Supabase');
      return res
        .status(500)
        .json({ error: 'Internal error during user creation.' });
    }

    await userService.createUser({
      email,
      username,
      supabaseId: user.id,
      firstName,
      lastName,
    });

    req.session.userId = req.session ? user.id : undefined;

    return res
      .status(200)
      .json({ message: 'User.ts registered successfully.', user });
  } catch (err) {
    console.error('Registration error:', err);
    return res
      .status(500)
      .json({ error: 'Internal server error during registration.' });
  }
};
