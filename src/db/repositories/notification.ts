import notificationSchemaModel from '../models/mongoose/notification';
import type { INotification } from '../models/mongoose/notification';
import { BaseRepository } from './base';

export default class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(notificationSchemaModel);
  }

  async getAllNotifications<INotification>(params : any): Promise<INotification | {} | null> {
    return (await this._model.find({ notification_to : params.id })
    .limit(params.limit)
    .skip(params.limit * params.page)
    .lean()) as INotification;
  }

}
