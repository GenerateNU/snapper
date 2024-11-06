import { DiveLog } from '../models/diveLog';
import { Document, Types } from 'mongoose';
import { UserModel } from '../models/users';

export interface DiveLogService {
  createDiveLog(data: Partial<Document>): Promise<Document>;
  getDiveLogById(id: string): Promise<Document | null>;
  updateDiveLog(id: string, data: Partial<Document>): Promise<Document | null>;
  deleteDiveLog(id: string): Promise<Document | null>;
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

    const user: any = await UserModel.findByIdAndUpdate(data.user, update, {
      new: true,
    });
    return diveLog;
  }

  async getDiveLogById(id: string): Promise<Document | null> {
    return DiveLog.findById(id).populate('speciesTags').exec();
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
}
