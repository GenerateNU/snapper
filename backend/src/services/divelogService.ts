import { DiveLog } from '../models/diveLog';
import { Document } from 'mongoose';
import divelog from '../routes/divelog';
import { UserModel } from '../models/users';

export interface DiveLogService {
  createDiveLog(data: Partial<Document>): Promise<Document>;
  getDiveLogById(id: string): Promise<Document | null>;
  updateDiveLog(id: string, data: Partial<Document>): Promise<Document | null>;
  deleteDiveLog(id: string): Promise<Document | null>;
}

export class DiveLogServiceImpl implements DiveLogService {
  async createDiveLog(
    data: Partial<Document & { user: string }>,
  ): Promise<Document> {
    console.log('Creating dive log with data:', data);

    const diveLog = await DiveLog.create(data);

    await UserModel.findByIdAndUpdate(
      data.user,
      { $addToSet: { diveLogs: diveLog._id } },
      { new: true },
    );
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
}
