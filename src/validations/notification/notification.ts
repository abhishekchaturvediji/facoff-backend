import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class VNotification extends Base {
  public markAsRead(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.notificationId = this.id(true);
    return Joi.object(schema);
  }
}
