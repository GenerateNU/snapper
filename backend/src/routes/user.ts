import express from 'express';
import { findUserBySupabaseId } from '../services/userService';

export default (router: express.Router) => {
    router.get('/user/:supabaseId', async (req, res) => {
        const { supabaseId } = req.params;
        try {
            const user = await findUserBySupabaseId(supabaseId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    });
}