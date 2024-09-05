import express from 'express';
import { supabase } from '../../config/supabaseClient';

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res
        .status(400)
        .json({ error: 'Failed to log out. Please try again later.' });
    }

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Failed to end session. Please try again later.' });
      }

      return res.status(200).json({ message: 'Logout successful.' });
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res
      .status(500)
      .json({ error: 'Internal server error during logout.' });
  }
};
