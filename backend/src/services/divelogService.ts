import { DiveLog } from '../models/diveLog';
import mongoose, { Document } from 'mongoose';
import { UserModel } from '../models/users';
import { NotFoundError } from '../consts/errors';
import { Notification } from '../models/notification';
import { getTaxonomyArrays } from '../utils/filter';

export interface DiveLogService {
  /**
   * Creates a new dive log.
   * @param data - Partial data for the new dive log.
   * @returns A promise that resolves to the created dive log document.
   */
  createDiveLog(data: Partial<Document>): Promise<Document>;

  /**
   * Retrieves a dive log by its ID.
   * @param id - The ID of the dive log to retrieve.
   * @returns A promise that resolves to the dive log document, or null if not found.
   */
  getDiveLogById(id: string): Promise<Document | null>;

  /**
   * Updates an existing dive log.
   * @param id - The ID of the dive log to update.
   * @param data - Partial data to update the dive log.
   * @returns A promise that resolves to the updated dive log document, or null if not found.
   */
  updateDiveLog(id: string, data: Partial<Document>): Promise<Document | null>;

  /**
   * Deletes a dive log by its ID.
   * @param id - The ID of the dive log to delete.
   * @returns A promise that resolves to the deleted dive log document, or null if not found.
   */
  deleteDiveLog(id: string): Promise<Document | null>;

  /**
   * Toggles the like status of a dive log for a user.
   * @param userId - The ID of the user toggling the like.
   * @param divelogId - The ID of the dive log to toggle the like on.
   * @returns A promise that resolves to the updated dive log document, or null if not found.
   */
  toggleLikeDiveLog(
    userId: string,
    divelogId: string,
  ): Promise<Document | null>;

  getNearbyDivelogs({
    lng,
    lat,
    userId,
    page,
    limit,
    filterValues,
  }: {
    lng: string;
    lat: string;
    userId: string;
    page: number;
    limit: number;
    filterValues: string[];
  }): Promise<Document[]>;
}

export class DiveLogServiceImpl implements DiveLogService {
  async createDiveLog(
    data: Partial<Document & { user: string; speciesTags?: string[] }>,
  ): Promise<Document> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const diveLog = await DiveLog.create([data], { session });

      const update: any = {
        $addToSet: {
          diveLogs: diveLog[0]._id,
        },
      };

      if (Array.isArray(data.speciesTags) && data.speciesTags.length > 0) {
        update.$addToSet.speciesCollected = { $each: data.speciesTags };
      }

      const user = await UserModel.findByIdAndUpdate(data.user, update, {
        new: true,
        session,
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      await session.commitTransaction();
      return diveLog[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const diveLog = await DiveLog.findById(id).session(session);
      if (!diveLog) {
        throw new NotFoundError('DiveLog not found');
      }

      // delete notification related to divelog
      await Notification.deleteMany({
        target: id,
        targetModel: 'DiveLog',
      }).session(session);

      // delete divelog
      await DiveLog.findByIdAndDelete(id).session(session);
      await session.commitTransaction();

      return diveLog;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async toggleLikeDiveLog(
    userId: string,
    divelogId: string,
  ): Promise<Document | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await UserModel.findById(userId).session(session);

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
        { new: true, session },
      );

      if (!updatedDiveLog) {
        throw new NotFoundError('Dive log not found');
      }

      await session.commitTransaction();
      return updatedDiveLog;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getNearbyDivelogs({
    lng,
    lat,
    userId,
    page,
    limit,
    filterValues,
  }: {
    lng: string;
    lat: string;
    userId: string;
    page: number;
    limit: number;
    filterValues: string[];
  }): Promise<Document[]> {
    const taxonomyArrays = getTaxonomyArrays(filterValues);

    const diveLogs = await DiveLog.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      {
        $lookup: {
          from: 'species',
          localField: 'speciesTags',
          foreignField: '_id',
          as: 'speciesInfo',
        },
      },
      {
        $match:
          taxonomyArrays.order.length > 0 ||
          taxonomyArrays.class.length > 0 ||
          taxonomyArrays.family.length > 0
            ? {
                $or: [
                  { 'speciesInfo.order': { $in: taxonomyArrays.order } },
                  { 'speciesInfo.class': { $in: taxonomyArrays.class } },
                  { 'speciesInfo.family': { $in: taxonomyArrays.family } },
                ],
              }
            : {},
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $match: {
          user: { $ne: userId },
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $addFields: {
          'user.profilePicture': '$userDetails.profilePicture',
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
    ]);

    return diveLogs;
  }
}
