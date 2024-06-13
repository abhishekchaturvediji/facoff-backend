import mongoose,{Types} from 'mongoose';
import GameTurn from "./game_turn";

export interface IGame extends mongoose.Document {
    createdBy? : Types.ObjectId;
    opponent? : Types.ObjectId ;
    turns? : any[] ;
    turnCount? : number 
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let GameSchema = new Schema(
  {
    createdBy: { type: ObjectId, ref: 'User' ,required: true },
    opponent: { type: ObjectId, ref: 'User' ,required: true},
    turns: [{ type: ObjectId, ref: GameTurn.modelName }],
    createByConfig : {
      currentStreak  : {type : Number, default : 0},
      longestStreak : {type : Number , default : 0}
    },
    opponentConfig : {  
      currentStreak  : {type : Number ,  default : 0},
      longestStreak : {type : Number , default : 0}
    },
    turnCount : { type : Number , default : 0 }
  },
  { timestamps: true }
);

const Game: mongoose.Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);

export default Game;
