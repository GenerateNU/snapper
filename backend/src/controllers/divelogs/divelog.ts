import {
  DiveLogService,
  DiveLogServiceImpl,
} from '../../services/divelogService';
const { validationResult } = require('express-validator');
import express from 'express';
import { UserService, UserServiceImpl } from '../../services/userService';
import {
  NotificationService,
  NotificationServiceImpl,
} from '../../services/notificationService';
import { ExpoService, ExpoServiceImpl } from '../../services/expoService';
import sendFilesToS3 from '../../services/filesToS3';

const diveLogService: DiveLogService = new DiveLogServiceImpl();
const userService: UserService = new UserServiceImpl();
const notificationService: NotificationService = new NotificationServiceImpl();
const expoService: ExpoService = new ExpoServiceImpl();

// using mongoId
export const DiveLogController = {
  createDiveLog: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const photos = req.body.photos;
    const links = await sendFilesToS3(photos);
    Object.defineProperty(req.body, 'photos', {
      value: links,
      enumerable: true,
    });

    const user = await userService.getUserById(req.body.user);
    if (user == null) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    try {
      const diveLog: any = await diveLogService.createDiveLog(req.body);
      const notifications = await notificationService.createPostNotification(
        diveLog.user,
        diveLog._id,
      );
      if (notifications && notifications.length > 0) {
        await expoService.sendPostNotification(notifications[0]);
      }
      res.status(201).json(diveLog);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getDiveLogById: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
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
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateDiveLog: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const updatedDiveLog = await diveLogService.updateDiveLog(
        req.params.id,
        req.body,
      );
      if (!updatedDiveLog) {
        res.status(404).json({ message: 'Dive log not found' });
        return;
      }
      res.status(200).json(updatedDiveLog);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteDiveLog: async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
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
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
