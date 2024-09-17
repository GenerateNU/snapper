import { DiveLogService, DiveLogServiceImpl } from "../services/divelogService";
const { validationResult } = require('express-validator');
import express from "express";

const diveLogService: DiveLogService = new DiveLogServiceImpl();

export const DiveLogController = {
    createDiveLog: async (req: express.Request, res: express.Response): Promise<void> => {
        console.log('Hello');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const diveLog = await diveLogService.createDiveLog(req.body);
            res.status(201).json(diveLog);
        } catch (error) {
            console.error('Create dive log error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getDiveLogById: async (req: express.Request, res: express.Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const diveLog = await diveLogService.getDiveLogById(req.params.id);
            if (!diveLog) {
                res.status(404).json({ message: 'Dive log not found' });
                return;
            }
            res.status(200).json(diveLog);
        } catch (error) {
            console.error('Get dive log by ID error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateDiveLog: async (req: express.Request, res: express.Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const updatedDiveLog = await diveLogService.updateDiveLog(req.params.id, req.body);
            if (!updatedDiveLog) {
                res.status(404).json({ message: 'Dive log not found' });
                return;
            }
            res.status(200).json(updatedDiveLog);
        } catch (error) {
            console.error('Update dive log error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteDiveLog: async (req: express.Request, res: express.Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const deleted = await diveLogService.deleteDiveLog(req.params.id);
            if (!deleted) {
                res.status(404).json({ message: 'Dive log not found' });
                return;
            }
            res.status(200).json({ message: 'Dive log deleted successfully' });
        } catch (error) {
            console.error('Delete dive log error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
