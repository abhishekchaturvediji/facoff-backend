import mongoose,{ Types } from 'mongoose';

export interface INotification extends mongoose.Document {
    notification_to : Types.ObjectId , 
    title : string ;    
    message : string ;    
    read_status? : boolean ;    
    type : string ;    
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let NotificationSchema = new Schema(
  {
    notification_to : {type : ObjectId, ref : 'User',required : true},
    title : {type : String},
    message : {type : String},
    read_status : {type : Boolean,default: false},
    type : {type : String}
  },
  { timestamps: true }
);


const Notification : mongoose.Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
