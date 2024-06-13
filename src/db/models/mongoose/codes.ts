import mongoose from 'mongoose';

export interface ICodes extends mongoose.Document {
  type: string;
  code: string;
  email: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}

let Schema = mongoose.Schema;
let emailMatch: [RegExp, string] = [/([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i, 'No email found ({VALUE})'];
/**
 * Codes schema for mangoose
 * @type {Schema}
 */
let CodesSchema = new Schema(
  {
    type: { type: String, required: [true, 'type required'] },
    code: { type: String, unique: true, required: [true, 'code required'] },
    email: {
      type: String,
      match: emailMatch,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Codes: mongoose.Model<ICodes> = mongoose.models.Codes || mongoose.model<ICodes>('Codes', CodesSchema);

export default Codes;
