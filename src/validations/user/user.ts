import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';
import constants from '../../common/constants';
import Base from '../base';

export default class VUser extends Base {
  private setPassType(isRequired: boolean): AnySchema {
    let schema = Joi.string()
      .trim()
      .valid(
        constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT,
        constants.ENUMS.HASH_TYPES.RESET_PASSWORD,
        constants.ENUMS.HASH_TYPES.INVITE_EMAIL
      );
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  private email(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().email();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  public getCreateUserVS(isUpdated: boolean): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.firstName = this.isString(!isUpdated);
    schema.lastName = this.isString(false);
    schema.email = this.email(!isUpdated);
    schema.password = this.isString(!isUpdated);
    schema.fcmToken = this.isString(false);
    schema.longitude = this.isNumber(false),
    schema.latitude = this.isNumber(false),
    schema.country = this.isString(true);
    schema.gender = this.isString(true);
    schema.dob = this.isString(true);
    schema.username = this.isString(true);
    return Joi.object(schema);
  }
  public getLoginVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      email: this.email(true),
      password: this.isString(true),
      fcmToken : this.isString(false),
      longitude : this.isNumber(false),
      latitude : this.isNumber(false),
    };
    return Joi.object(schema);
  }

  public getLoginOnlyVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      email: this.email(true),
      password: this.isString(true),
    };
    return Joi.object(schema);
  }

  public getIdVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      id : this.id(true),
    };
    return Joi.object(schema);
  }

  public userByIdVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.id = this.id(true);
    return Joi.object(schema);
  }
  public getChangePasswordVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.oldPassword = this.isString(true);
    schema.password = this.isString(true);

    return Joi.object(schema);
  }
  public getUpdateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      firstName: this.isString(false),
      lastName: this.isString(false),
      oldPassword : this.isString(false),
      password : this.isString(false),
    };

    return Joi.object(schema);
  }
  public getAuthVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      firstName: this.isString(true),
      lastName: this.isString(false).allow(null),
      photo: this.isString(false),
      email: this.email(true),
      type: this.isString(true),
      socialId: this.isString(true),
      fcmToken : this.isString(false),
      dob : this.isString(true),
      username : this.isString(true),
      gender : this.isString(true),
      country : this.isString(true),
      password : this.isString(true),
      latitude : this.isNumber(false),
      longitude : this.isNumber(false),
    };

    return Joi.object(schema);
  }
  public getSetPassword(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.hash = this.isString(true);
    schema.password = this.isString(false);
    schema.type = this.setPassType(true);

    return Joi.object(schema);
  }

  public getAcctProfile(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.firstName = this.isStringAlpha(false);
    schema.lastName = this.isStringAlpha(false);
    schema.title = this.isString(false);
    return Joi.object(schema);
  }
  public getEmail(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.hash = this.isString(true);

    return Joi.object(schema);
  }
 
//   public getUserListVs(): ObjectSchema {
//     const schema: PartialSchemaMap = {};

//     schema.isArchived = this.isBoolean(true);
//     schema.page = this.isString(true);
//     schema.limit = this.isString(true);
//     schema.order = this.order(true);
//     schema.orderBy = this.isString(true);
//     schema.search = this.isString(false);

//     return Joi.object(schema);
//   }

  protected name(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  protected message(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  public contactUs(isRequired: boolean): AnySchema {
    let schema = Joi.object({
      email: this.email(isRequired),
      name: this.name(isRequired),
      message: this.message(isRequired),
    });
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  public verifyEmail(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.email = this.email(true);
    return Joi.object(schema);
  }

  public opponentUserVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.type = this.isString(true);
    schema.value = this.isString(false);
    return Joi.object(schema);
  }
}
