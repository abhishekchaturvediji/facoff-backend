import mongoose from 'mongoose';

export interface IClothingUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  fullName: string;
  companyName: string,
  email: string,
  phone: string,
  state: string,
  country: string,
  stateSalesTaxId: string,
  annualApparelPurchase: string,
  typeOfBussiness: string,
  hearFrom: string,
  attachment: object,
}

let Schema = mongoose.Schema;

/**
 * User schema for mangoose
 * @type {Schema}
 */

let ClothingUsersSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    companyName: { type: String },
    email: {type: String },
    phone: {type: Number },
    state: {type: String },
    country: {type: String },
    stateSalesTaxId: {type: String },
    annualApparelPurchase: {type: Number },
    typeOfBussiness : {type : String},
    hearFrom  : {type : String},
    attachment : [
        {
          link: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
        },
      ],
  },
  { timestamps: true }
);


const ClothingUser : mongoose.Model<IClothingUser> = mongoose.models.User || mongoose.model<IClothingUser>('shopifyClothingUser', ClothingUsersSchema);

export default ClothingUser;