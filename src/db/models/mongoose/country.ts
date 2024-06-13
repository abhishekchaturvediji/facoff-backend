import mongoose, { Types } from 'mongoose';

export interface ICountry extends mongoose.Document {
    name : string, 
    category : Types.ObjectId | object ;    
}

let Schema = mongoose.Schema;

//Validation match
/**
 * game schema for mangoose
 * @type {Schema}
 */

let CountrySchema = new Schema(
  {
    name: {type : String},
    code: { type: String},
  },
  { timestamps: true }
);


const Country: mongoose.Model<ICountry> = mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);

export default Country;
