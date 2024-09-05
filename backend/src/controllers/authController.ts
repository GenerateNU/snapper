// import express from 'express';
// import { supabase } from '../config/supabaseClient';
// import { createUser } from '../services/userService';
// import session from 'express-session';

// export const register = async (req: express.Request, res: express.Response) => {
//   try {
//     const { email, password, username } = req.body;

//     if (!email || !password || !username) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const { data, error } = await supabase.auth.signUp({ email, password });

//     if (error) {
//       console.error('Supabase signUp error:', error.message);
//       return res.status(400).json({ error: error.message });
//     }

//     const user = data.user;
//     if (!user) {
//       console.error('User creation failed: no user returned from Supabase');
//       return res.status(400).json({ error: 'User creation failed' });
//     }

//     await createUser({ email, username, supabaseId: user.id });

//      req.session.userId = req.session ? user.id : undefined;

//     return res.status(200).json({ message: 'User registered successfully', user });
//   } catch (err) {
//     console.error('Registration error:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// export const login = async (req: express.Request, res: express.Response) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }

//   const user = data.user;

//   if (!user) {
//     return res.status(400).json({ error: 'Login failed' });
//   }

//   req.session.userId = req.session ? user.id : undefined;

//   return res.status(200).json({ message: 'Login successful', user });
// };

// export const logout = async (req: express.Request, res: express.Response) => {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     return res.status(400).json({ error: 'Failed to log out' });
//   }

//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to destroy session' });
//     }

//     return res.status(200).json({ message: 'Logout successful' });
//   });
// };
