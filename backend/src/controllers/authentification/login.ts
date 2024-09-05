import express from 'express';
import { supabase } from '../../config/supabaseClient';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: 'Invalid email or password. Please try again.' });
    }

    const user = data.user;

    if (!user) {
      return res
        .status(500)
        .json({ error: 'Login failed. Please try again later.' });
    }

    req.session.userId = req.session ? user.id : undefined;

    return res.status(200).json({ message: 'Login successful.', user });
  } catch (err) {
    console.error('Login error:', err);
    return res
      .status(500)
      .json({ error: 'Internal server error during login.' });
  }
};
