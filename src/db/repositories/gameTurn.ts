import mongoose from 'mongoose';
import gameTurnSchemaModel from '../models/mongoose/game_turn';
import type { IGameTurns } from '../models/mongoose/game_turn';
import { BaseRepository } from './base';

export default class GameRepository extends BaseRepository<IGameTurns> {
  constructor() {
    super(gameTurnSchemaModel);
  }

  async getWinTurnsByType<IGameTurns>(_id: string , type : string ): Promise<IGameTurns | null | any> {
    const result = await this._model.aggregate([
      {
        $match: {
          'guessResult.guessBy':  new mongoose.Types.ObjectId(_id),
          'guessResult.result': true
        }
      },
      {
        $lookup: {
          from: 'emotions',
          localField: 'emotionSelectedId',
          foreignField: '_id',
          as: 'emotionSelected'
        }
      },
      { $unwind: '$emotionSelected' },
      {
        $lookup: {
          from: 'emotioncategories',
          localField: 'emotionSelected.category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $match: {
          'category.name': type
        }
      },
      {
        $count: 'total'
      }
    ]);

    return result.length > 0 ? result[0].total : 0;;
  } 

}
