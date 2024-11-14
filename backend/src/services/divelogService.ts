import { DiveLog } from '../models/diveLog';
import mongoose, { Document } from 'mongoose';
import { UserModel } from '../models/users';
import { NotFoundError } from '../consts/errors';

export interface DiveLogService {
  createDiveLog(data: Partial<Document>): Promise<Document>;
  getDiveLogById(id: string): Promise<Document | null>;
  updateDiveLog(id: string, data: Partial<Document>): Promise<Document | null>;
  deleteDiveLog(id: string): Promise<Document | null>;
  toggleLikeDiveLog(userId: string, divelogId: string): Promise<Document | null>;
}

export class DiveLogServiceImpl implements DiveLogService {
  async createDiveLog(
    data: Partial<Document & { user: string; speciesTags?: string[] }>,
  ): Promise<Document> {
    const diveLog = await DiveLog.create(data);

    // update diveLogs in user
    const update: any = {
      $addToSet: {
        diveLogs: diveLog._id,
      },
    };

    if (data.speciesTags && data.speciesTags.length > 0) {
      update.$addToSet.speciesCollected = { $each: data.speciesTags };
    }

    await UserModel.findByIdAndUpdate(data.user, update, {
      new: true,
    });
    return diveLog;
  }

  async getDiveLogById(id: string): Promise<Document | null> {
    return DiveLog.findById(id)
      .populate('speciesTags')
      .populate('user', 'profilePicture username')
      .exec();
  }

  async updateDiveLog(
    id: string,
    data: Partial<Document>,
  ): Promise<Document | null> {
    return DiveLog.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteDiveLog(id: string): Promise<Document | null> {
    return DiveLog.findByIdAndDelete(id).exec();
  }

  async toggleLikeDiveLog(userId: string, divelogId: string): Promise<Document | null> {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedDiveLog = await DiveLog.findByIdAndUpdate(
      divelogId,
      [
        {
          $set: {
            likes: {
              $cond: {
                if: { $in: [user._id, '$likes'] },
                then: {
                  $filter: {
                    input: '$likes',
                    cond: { $ne: ['$$this', user._id] },
                  },
                },
                else: { $concatArrays: ['$likes', [user._id]] },
              },
            },
          },
        },
      ],
      { new: true },
    );

    if (!updatedDiveLog) {
      throw new NotFoundError('Dive log not found');
    }

    return updatedDiveLog;
  }
}
