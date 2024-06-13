// import type {
//     UserDetails,
// } from '../types/request/notification';
  import {
    NotificationRepository
  } from '../../db/repositories';
  // , AuthParams 
  import { ServiceReturnVal } from '../../types/common';
  import { RespError } from '../../lib/wr_response';
  // import { INotification } from '../db/models/mongoose/notification';
  // import utility from '../lib/utility';
  import Base from '../base';
  import constants from '../../common/constants';
//   import moment from 'moment';

import notification from "../../db/models/mongoose/notification";
import { TokenUser } from '../../types/request/user';

export default class NotificationService extends Base {
  private notificationRepo = new NotificationRepository();
  /**
   * @description Function for registration of users
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async getAllNotifications(params : any,currentUser : TokenUser): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    const { limit } = params;
    params.id = currentUser._id;
    const filtredNotifications = await this.notificationRepo.find({ user: currentUser._id });
    const total = filtredNotifications.length;
    const notifications = await this.notificationRepo.getAllNotifications(params)

    if (!notifications) { 
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.NO_NOTIFICATION_FOUND);
      return returnVal
    }
    
    returnVal.data = { totalpage: Math.ceil(total / limit), notifications  };

    return returnVal
  }

  public async deleteNotification(params : any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};

    const { id } = params ;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, `You must give a valid id: ${id}`);
      return returnVal
    }

    const deleteNotification = await notification.findById(id).exec();
    if (!deleteNotification) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, `Can't find a notification with id: ${id}`);
      return returnVal
    }

    const result = await deleteNotification.deleteOne();
    if (!result) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, `Can't delete the notification with id: ${id}` );
      return returnVal
    }
    
    returnVal.data = `Notification with id: ${id} deleted with success` 

  }

  public async deleteAllNotifications(params: any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};

    try {
      const { id } = params;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, `You must give a valid id: ${id}`);
        return returnVal;
      }

      const notificationsDeleteMany = await notification.deleteMany({ user: id });
      if (!notificationsDeleteMany) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, 'Error Deleting all notifications as read');
        return returnVal;
      }

      returnVal.data = `All notifications for user ${id} marked was deleted`;
      return returnVal;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message || 'Internal Server Error');
      return returnVal;
    }
  }

  public async markOneNotificationasread(params: any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    console.log(" params : ", params);
    
    try {
      const { notificationId } = params;
      const id = notificationId;

      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, `You must give a valid id: ${id}`);
        return returnVal;
      }

      const updateNotification = await notification.findById(id).exec();
      if (!updateNotification) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, 'No notifications found');
        return returnVal;
      }

      updateNotification.read_status = false;
      await updateNotification.save();

      returnVal.data = updateNotification;
      return returnVal;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message || 'Internal Server Error');
      return returnVal;
    }
  }

  public async markAllNotificationsAsRead(params: TokenUser): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};

    try {
      const { _id } = params;

      if (!_id || !_id.match(/^[0-9a-fA-F]{24}$/)) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, `You must give a valid user`);
        return returnVal;
      }

      const notificationsUpdateMany = await notification.updateMany({ notification_to : this.notificationRepo.toObjectId(_id) }, { $set: { read_status: true } });
      if (!notificationsUpdateMany) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, 'Error Marking all notifications as read');
        return returnVal;
      }

      returnVal.data = `All notifications marked as read`;
      return returnVal;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message || 'Internal Server Error');
      return returnVal;
    }
  }


}
  