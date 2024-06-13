import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';
import constants from '../../common/constants';

export default class VGame extends Base {
  public getCreateGameVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.opponent = this.id(true);
    schema.emotionSelectedId = this.isString(true);
    schema.emotionSelectedName = this.isString(true);
    schema.comment = this.isString(false);
    return Joi.object(schema);
  }

  public getGuessTurnVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.turnId = this.id(true);
    schema.result = this.isBoolean(true);
    schema.emotionSelectedId = this.id(true);
    schema.emotionSelectedName = this.isString(true);
    schema.comment = this.isString(false);
    return Joi.object(schema);
  }

  public getNextTurnVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.gameId = this.id(true);
    schema.opponent = this.id(true);
    schema.emotionSelectedId = this.id(true);
    schema.emotionSelectedName = this.isString(true);
    schema.comment = this.isString(false);
    return Joi.object(schema);
  } 

  public getTurnData(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.turnId = this.id(true);
    return Joi.object(schema);
  }

  public getLifeLineVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.lifelineType = this.isValid([...Object.keys(constants.LIFELINE_TYPE)],false)
    return Joi.object(schema);
  }

}
