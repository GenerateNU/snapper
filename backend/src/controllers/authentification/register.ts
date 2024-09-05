import express from 'express';
import { supabase } from '../../config/supabaseClient';
import { createUser } from '../../services/userService';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: 'Email, password, and username are required.' });
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
      console.error('User creation failed: no user returned from Supabase');
      return res
        .status(500)
        .json({ error: 'Internal error during user creation.' });
    }

    await createUser({ email, username, supabaseId: user.id });

    req.session.userId = req.session ? user.id : undefined;

    return res
      .status(200)
      .json({ message: 'User registered successfully.', user });
  } catch (err) {
    console.error('Registration error:', err);
    return res
      .status(500)
      .json({ error: 'Internal server error during registration.' });
  }
};
