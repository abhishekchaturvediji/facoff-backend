import { ServiceReturnVal } from '../../types/common';
import { RespError } from '../../lib/wr_response';
import Base from '../base';
import constants from '../../common/constants';
import clothingUser from "../../db/shopify/mongoose/clothing_users";
import utility from '../../lib/utility';

export default class ClothingUserService extends Base {
  /**
   * @description Function for registration of users
   * @param 
   * @returns 
   */
  public async registerClothingUser(params:any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    let firstName = '';
    let lastName = '';
    let fullName = '';

    if (params.firstName) {
      firstName = params.firstName;
      if (!params.lastName) {
        const named = params.firstName.split(' ');
        if (named.length > 1) {
          firstName = named[0];
          lastName = named[1];
        }
        fullName = params.firstName;
      } else {
        fullName = `${params.firstName} ${params.lastName}`;
      }
    }
    if (params.lastName) lastName = params.lastName;

    let resgiterUser = {
      firstName: firstName,
      lastName: lastName ,
      fullName: fullName ,
      companyName: params.companyName ,
      email: params.email ,
      phone: params.phone ,
      state: params.state ,
      country: params.country ,
      stateSalesTaxId: params.stateSalesTaxId ,
      annualApparelPurchase: params.annualApparelPurchase ,
      typeOfBussiness: params.typeOfBussiness ,
      hearFrom: params.hearFrom ,
      attachment : []
    }


    console.log(" params.files['assets'] ", params.files['attachment']);
    
    if (!utility.isEmpty(params.files) && !utility.isEmpty(params.files['attachment'])) {
      for (let index = 0; index < params.files['attachment'].length; index++) {
        const imageInfo = params.files['attachment'][index];
        resgiterUser['attachment'].push({link : imageInfo['location'] ,type : imageInfo['mimetype']}) 
      }
    }

    let user = await clothingUser.create(resgiterUser);

    if (!user) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.NO_EMOTION_FOUND);
      return returnVal
    }

    returnVal.data = { user };
    return returnVal
  }

}
