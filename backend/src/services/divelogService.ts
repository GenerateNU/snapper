import { DiveLog } from '../models/diveLog';
import { Document, Types } from 'mongoose';
import { UserModel } from '../models/users';

export interface DiveLogService {
  createDiveLog(data: Partial<Document>): Promise<Document>;
  getDiveLogById(id: string): Promise<Document | null>;
  updateDiveLog(id: string, data: Partial<Document>): Promise<Document | null>;
  deleteDiveLog(id: string): Promise<Document | null>;
  likeDiveLog(userId: string, divelogId: string): Promise<Document | null>;
  unlikeDiveLog(userId: string, divelogId: string): Promise<Document | null>;
}

export class DiveLogServiceImpl implements DiveLogService {
  async createDiveLog(
    data: Partial<Document & { user: string; fishTags?: string[] }>,
  ): Promise<Document> {
    const diveLog = await DiveLog.create(data);

    // update diveLogs in user
    const update: any = {
      $addToSet: {
        diveLogs: diveLog._id,
      },
    };

    // update fishCollected in user
    if (data.fishTags && data.fishTags.length > 0) {
      update.$addToSet.fishCollected = { $each: data.fishTags };
    }

    await UserModel.findByIdAndUpdate(data.user, update, { new: true });
    return diveLog;
  }

  async getDiveLogById(id: string): Promise<Document | null> {
    return DiveLog.findById(id).exec();
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

  async likeDiveLog(
    userId: string,
    divelogId: string,
  ): Promise<Document | null> {
    const updatedDiveLog = await DiveLog.findByIdAndUpdate(
      divelogId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    return updatedDiveLog;
  }

  async unlikeDiveLog(
    userId: string,
    divelogId: string,
  ): Promise<Document | null> {
    const updatedDiveLog = await DiveLog.findByIdAndUpdate(
      divelogId,
      { $pull: { likes: userId } },
      { new: true },
    );
    return updatedDiveLog;
  }
}
