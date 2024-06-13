import emotionSchemaModel from '../models/mongoose/emotion';
import type { IEmotion } from '../models/mongoose/emotion';
import { BaseRepository } from './base';

export default class EmotionRepository extends BaseRepository<IEmotion> {
  constructor() {
    super(emotionSchemaModel);
  }

}
