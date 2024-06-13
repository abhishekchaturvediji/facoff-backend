import mongoose from 'mongoose';

export interface IEmotionCategory extends mongoose.Document {
  name : string, 
  rewardCoin : number ;    
}

let Schema = mongoose.Schema;

//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let EmotionCategorySchema = new Schema(
  {
    name: {type : String},
    rewardCoin : {type : Number}
  },
  { timestamps: true }
);


const EmotionCategory : mongoose.Model<IEmotionCategory> = mongoose.models.EmotionCategory || mongoose.model<IEmotionCategory>('EmotionCategory', EmotionCategorySchema);

export default EmotionCategory;
