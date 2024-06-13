import mongoose, { Types } from 'mongoose';
import EmotionCategory from "./emotion_category";

export interface IEmotion extends mongoose.Document {
    name : string, 
    category : Types.ObjectId | object ;    
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let EmotionSchema = new Schema(
  {
    name: {type : String},
    category: { type: ObjectId, ref: EmotionCategory.modelName ,required: true},
  },
  { timestamps: true }
);


const Emotion: mongoose.Model<IEmotion> = mongoose.models.Emotion || mongoose.model<IEmotion>('Emotion', EmotionSchema);

export default Emotion;
