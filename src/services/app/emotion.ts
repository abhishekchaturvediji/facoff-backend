// import type {
//     UserDetails,
// } from '../types/request/notification';
//   import {
//     NotificationRepository
//   } from '../db/repositories';
import { ServiceReturnVal } from '../../types/common';
import { RespError } from '../../lib/wr_response';
//   import { INotification } from '../db/models/mongoose/notification';
import Base from '../base';
import constants from '../../common/constants';
//   import moment from 'moment';
import emotionCategory from "../../db/models/mongoose/emotion_category";
import emotion from "../../db/models/mongoose/emotion";

export default class EmotionService extends Base {
  //   private notificationRepo = new NotificationRepository();
  /**
   * @description Function for registration of users
   * @param 
   * @returns 
   */
  public async getEmotions(): Promise<ServiceReturnVal<Object>> {

    const returnVal: ServiceReturnVal<Object> = {};
 
    const category = await emotionCategory.find();

    let emotions = [] ;
    for (let index = 0; index < category.length; index++) {
      const element = category[index];
      const randomEmotion = await emotion.aggregate([
        { $match: { category: element._id } },
        { $sample: { size: 1 } },
      ]);
      
      emotions.push({ _id : element._id,category : { name : element.name} ,emotions : randomEmotion[0]});
    }


    if (!emotions) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.NO_EMOTION_FOUND);
      return returnVal
    }

    returnVal.data = { emotions };
    return returnVal
  }

}


