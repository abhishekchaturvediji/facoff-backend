import mongoose from 'mongoose';

export interface IActiveUser extends mongoose.Document {
    date : string, 
    activeUserIds : [] ;    
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let ActiveUserSchema = new Schema(
  {
    date: { type: Date, required: true },
    activeUserIds: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);


const ActiveUser: mongoose.Model<IActiveUser> = mongoose.models.ActiveUser || mongoose.model<IActiveUser>('ActiveUser', ActiveUserSchema);

export default ActiveUser;
