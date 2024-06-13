// import mongoose from 'mongoose';
import gameSchemaModel from '../models/mongoose/game';
import type { IGame } from '../models/mongoose/game';
import { BaseRepository } from './base';

export default class GameRepository extends BaseRepository<IGame> {
  constructor() {
    super(gameSchemaModel);
  }

  async updateOne<IGame>(_id: string, item: IGame ): Promise<IGame | null> {
    return (await this._model.updateOne({ _id: _id }, item, {
      new: true,
    })) as IGame;
  }

  async getMyGames<IGame>(_id: any): Promise<IGame[] | null> {
    return await this._model.aggregate([
        {
          $match: {
            $or: [{ createdBy: _id }, { opponent: _id }]
          }
        },
        {
          $lookup: {
            from: 'gameturns', // Assuming the collection name for turns is 'gameturns'
            localField: 'turns', // Assuming 'turns' is an array field in the game model
            foreignField: '_id',
            as: 'turns'
          }
        },
        {
          $lookup: {
            from: 'users', // Assuming the collection name for turns is 'gameturns'
            localField: 'createdBy', // Assuming 'turns' is an array field in the game model
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        {
          $lookup: {
            from: 'users', // Assuming the collection name for turns is 'gameturns'
            localField: 'opponent', // Assuming 'turns' is an array field in the game model
            foreignField: '_id',
            as: 'opponent'
          }
        },
        {
          $unwind: '$turns' 
        },
        {
          $unwind: '$createdBy' 
        },
        {
          $unwind: '$opponent' 
        },
        {
          $sort: {
            'turns.createdAt': -1 // Sort by createdAt in descending order
          }
        },
        {
          $group: {
            _id: '$_id',
            game: { $first: '$$ROOT' }, // Include the first game document in each group
          }
        }
    ]).exec();
  }

  async getDistinct<IGame>(_id: string,key : string ): Promise<IGame | null> {
    return (await  this._model.find({ key : _id }).distinct(key)) as IGame;
  }

  async getMyGamesList<IGame>(_id: string): Promise<IGame | null> {
    return (this._model.find({$or: [{ createdBy: _id }, { opponent: _id }]})) as IGame;
  }
  
}
