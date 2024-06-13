import emotionCateorySchemaModel from '../models/mongoose/emotion_category';
import type { IEmotionCategory } from '../models/mongoose/emotion_category';
import { BaseRepository } from './base';

export default class EmotionRepository extends BaseRepository<IEmotionCategory> {
  constructor() {
    super(emotionCateorySchemaModel);
  }

}
