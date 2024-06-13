import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin extends mongoose.Document {
  type?: String;
  username?: String;
  email?: String;
  password?: String;
  createdAt?: Date;
  updatedAt?: Date;
}

let Schema = mongoose.Schema;
let emailMatch: [RegExp, string] = [/([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i, 'No email found ({VALUE})'];
/**
 * Codes schema for mangoose
 * @type {Schema}
 */
let adminSchema = new Schema(
  {
    type: { type: String, required: [true, 'type required'] },
    username: { type: String, required: [true, 'name required'] },
    email: {
      type: String,
      match: emailMatch,
      unique: true
    },
    password : { type : String }
  },
  { timestamps: true }
);


// Bcrypt middleware on UserSchema
adminSchema.pre('save', function (next) {
  var user: IAdmin = this as IAdmin;
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


const Admin: mongoose.Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
