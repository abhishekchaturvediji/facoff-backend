import NotificationService from '../../services/app/notification';
import Notification from '../../validations/notification/notification';
import WRRequest from '../../lib/wr_request';
import { Response } from 'express';
import {
  UserDetails,
} from '../../types/request/user';
import { markAsRead } from "../../types/request/notification";
import { RespError, WRResponse } from '../../lib/wr_response';
// import { AuthParams } from '../types/common';


export default class UserController {
  private service = new NotificationService();
  private resp = new WRResponse();
  
  public async getAllNotifications(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const params = request.query;
    const currentUser = request.currentUser;
    // const valSchema = new User().getCreateUserVS(false);
    // const result = valSchema.validate(request.body);
    // if (result.error == null) {
      const resp = await this.service.getAllNotifications(params,currentUser);
      this.resp.resp(response).send(resp);
    // } else {  
   //   this.resp.resp(response).error(RespError.validation(result.error.message));
    // }

  }


  public async deleteNotification(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new Notification().markAsRead();
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.deleteNotification(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async markOneNotificationasread(request: WRRequest<undefined, markAsRead, undefined>, response: Response) {
    const { data } = request.body as any;
    const valSchema = new Notification().markAsRead();
    const result = valSchema.validate(data);
    
    if (result.error == null) {
      const resp = await this.service.markOneNotificationasread(data);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }    
  }

  public async markAllNotificationasread(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    try {
      const currentUser = request.currentUser;
      const resp = await this.service.markAllNotificationsAsRead(currentUser);
      this.resp.resp(response).send(resp);
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }

  }

}
