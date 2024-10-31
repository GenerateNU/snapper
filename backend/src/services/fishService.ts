import { Types } from 'mongoose';
import { Fish } from './../models/fish';
import { Document } from 'mongodb';

export interface FishService {
    getFish(id: Types.ObjectId[]): Promise<Document[]>;
}

export class FishServiceImpl implements FishService {
    async getFish(id: Types.ObjectId[]): Promise<Document[]> {
        return Fish.find({ _id: { $in: id } }).exec();
    }
}
