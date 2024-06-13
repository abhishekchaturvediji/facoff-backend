import mongoose, { Types } from 'mongoose';

export interface IGameTurns extends mongoose.Document {
    turn_by : Types.ObjectId;
    emotion_selected_id : Types.ObjectId ;
    media_path : string ;
    emotionSelectedName : string,
    comment?: string ;
    guessResult? : Object
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let GameTurnSchema = new Schema(
  {
    turnBy : { type: ObjectId, ref: 'User',required: true },
    emotionSelectedId: { type: ObjectId, ref: 'Emotion' ,required: true},
    emotionSelectedName:{type: String},
    mediaPath: { type : String },
    comment: {type : String},
    guessResult : {
      result : {type : Boolean},
      selectedEmotionId : { type: ObjectId, ref: 'Emotion' },
      emotionSelectedName:{type: String},
      comment : { type : String },
      rewardCoins : { type : Number },
      guessBy : { type: ObjectId, ref: 'User' }
    },
  },
  { timestamps: true }
);


const GameTurn: mongoose.Model<IGameTurns> = mongoose.models.GameTurn || mongoose.model<IGameTurns>('GameTurn', GameTurnSchema);

export default GameTurn;
