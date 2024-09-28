import { DiveLog } from '../models/diveLog';
import { Document } from 'mongoose';
import divelog from '../routes/divelog';

export interface DiveLogService {
  createDiveLog(data: Partial<Document>): Promise<Document>;
  getDiveLogById(id: string): Promise<Document | null>;
  updateDiveLog(id: string, data: Partial<Document>): Promise<Document | null>;
  deleteDiveLog(id: string): Promise<Document | null>;
}

export class DiveLogServiceImpl implements DiveLogService {
  async createDiveLog(data: Partial<Document>): Promise<Document> {
    return DiveLog.create(data);
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
