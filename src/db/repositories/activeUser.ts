import { id } from '../../types/request/user';
import activeUserSchemaModel from '../models/mongoose/active_users';
import type { IActiveUser } from '../models/mongoose/active_users';
import { BaseRepository } from './base';
const moment = require('moment');

export default class EmotionRepository extends BaseRepository<IActiveUser> {
  constructor() {
    super(activeUserSchemaModel);
  }

  async updateUserActivity<IActiveUser>(userId: id): Promise<IActiveUser | null> {
    const today = moment().format('YYYY-MM-DD');
    return (await this._model.findOneAndUpdate(
      { date: today },
      { $addToSet: { activeUserIds: userId } },
      { upsert: true, new: true } 
    )
    ) as unknown as IActiveUser;
  }

  async getActiveUserGraphData<IActiveUser>(): Promise<IActiveUser | null> {
    return (await this._model.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%d %m %Y', date: '$_id' }
          },
          count: { $sum: { $size: '$activeUserIds' } }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          x: '$_id',
          y: '$count'
        }
      }
  ])) as any;

  }

}
