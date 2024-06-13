import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
  location: any;
  maxStreak: number;
  email : string;
  password: string;
  firstName: string;
  lastName: string;
  username : string ;
  fullName: string;
  photo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastActivity?: Date;
  type: 'GOOGLE' | 'FACEBOOK' | 'CUSTOM';
  socialId : string;
  status: string;
  fcmToken? : string;
  country? : string,
  gender? : 'Male' | 'Female' ,
  dob? : Date ,
  coins? : number,
}

let Schema = mongoose.Schema;

//Validation match
let emailMatch: [RegExp, string] = [/([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i, 'No email found ({VALUE})'];
/**
 * User schema for mangoose
 * @type {Schema}
 */

let UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    username: { type: String },
    email: {
      type: String,
      match: emailMatch,
      unique: [true, 'Email already exists'],
    },
    password: { type: String },
    photo: { type: String, default: null },
    lastActivity: {
      type: Date,
      default: new Date(),
    },
    type: {
      type: String,
      enum: ['GOOGLE', 'FACEBOOK', 'CUSTOM'],
      default: 'CUSTOM',
    },
    maxStreak : { type : Number,default : 0} , 
    country : { type : String } , 
    gender : { type : String ,enum : ['Male','Female'] } , 
    dob : { type : Date } , 
    coins : {type : Number , default : 0},
    socialId : { type: String , default : null },
    status: { type: String, default: null },
    fcmToken : { type : String, default: null },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      }
  }
  },
  { timestamps: true }
);

UserSchema.index({ location: '2dsphere' });

// Bcrypt middleware on UserSchema
UserSchema.pre('save', function (next) {
  var user: IUser = this as IUser;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // console.log('user.password', user.password);

    if (user.password !== undefined) {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        return next();
      });
    }
  });
});

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
