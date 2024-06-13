// import mongoose from 'mongoose';
import userSchemaModel from '../models/mongoose/user';
import type { IUser } from '../models/mongoose/user';
import { BaseRepository } from './base';

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(userSchemaModel);
  }
  async userByEmail<IUser>(email: string): Promise<IUser | null> {
    return (await this._model.findOne({ email: email }).select({ _id: true })) as unknown as IUser;
  }
  async userByEmaiAllDets<IUser>(email: string): Promise<IUser | null> {
    return (await this._model.findOne({ email: email })) as unknown as IUser;
  }
  async updateById<IUser>(_id: string, item: IUser): Promise<IUser | null> {
    return (await this._model.findOneAndUpdate({ _id: _id }, item, {
      new: true,
    })) as IUser;
  }
  async fetchUsers(cond: Object, fields?: Object, options?: Object, page?: number, limit?: number, sort?: any) {
    return await this._model
      .find(cond, fields, options)
      .select({
        firstName: 1,
        lastName: 1,
        fullName: 1,
        email: 1,
        lastActivity: 1,
        status: 1,
        gender : 1,
        country : 1,
        maxStreak : 1,
        photo : 1,
        dob : 1
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);
  }
  async countDocuments(type) {
    return await this._model.countDocuments(type);
  }
  async updateByEmail<IUser>(email: string, item?: IUser): Promise<IUser | null> {
    return (await this._model.findOneAndUpdate({ email: email }, item, {
      new: true,
    })) as IUser;
  }
  async fetchUser<IUser>(cond: Object): Promise<IUser | null> {
    return (await this._model.findOne(cond).select({ password: 0 })) as unknown as IUser;
  }

  async sortAndSelect<IUser>(inId :Object,orderBy ): Promise<IUser | null> {
    return (await this._model.find({ _id : { $in: inId } })
    .sort({ coins: orderBy === 'asc' ? 1 : -1 })
    .select('fullName coins maxStreak')) as unknown as IUser;
  }

  async sortAndSelectWithCountry<IUser>(selecteCountry : string ): Promise<IUser | null> {
    return (await this._model.find({country : selecteCountry})
    .sort({ coins : -1 })
    .select('fullName coins maxStreak')) as unknown as IUser;
  }

  async findAndSort<IGame>(): Promise<IGame | null> {
    return (await  this._model.find().sort({coins : -1}).select(['fullName','coins','maxStreak','_id']) ) as IGame;
  }


  async getUsersWithinRadius(excludeUserId: any,latitude: number, longitude: number, radiusMiles: number): Promise<IUser | null | any[]> {
    
    return (await this._model.aggregate([
      {
          $geoNear: {
            near: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            distanceField: 'distance',
            maxDistance: radiusMiles * 1609.34, // Convert miles to meters
            spherical: true
          }
      },
      {
        $addFields: {
            distanceMiles: { $divide: ['$distance', 1609.34] } // Convert distance from meters to miles
        }
      },
      {
        $match: {
          _id: { $ne: excludeUserId } // Exclude the specified user ID
        }
      }
    ])) as unknown as IUser
   
  }
  
}
