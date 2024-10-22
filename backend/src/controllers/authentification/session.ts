import express from 'express';
import { supabase } from '../../config/supabaseClient';

export const getSession = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return res
        .status(500)
        .json({ error: 'Failed to retrieve session.', message: error.message });
    }

    if (data.session) {
      return res
        .status(200)
        .json({
          message: 'Session retrieved successfully.',
          session: data.session,
        });
    } else {
      return res.status(404).json({ error: 'No active session found.' });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: 'Internal server error.', message: err.message });
  }
};
