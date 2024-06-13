import UserService from '../../services/app/user';
import User from '../../validations/user/user';
import WRRequest from '../../lib/wr_request';
import { Response } from 'express';
import {
  UserDetails,
  getUserForGame,
  VerifyHash,
  updateProfile
} from '../../types/request/user';
import { RespError, WRResponse } from '../../lib/wr_response';
import { AuthParams } from '../../types/common';

export default class UserController {
  private service = new UserService();
  private resp = new WRResponse();
  public async register(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getCreateUserVS(false);
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.register(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
  public async login(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getLoginVS();
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.login(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
  public async socialLogin(request: WRRequest<undefined, AuthParams, undefined>, response: Response) {
    const valSchema = new User().getAuthVS();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.socialLogin(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
  public async profileUpdate(request: WRRequest<undefined, updateProfile, undefined>, response: Response) {
    const valSchema = new User().getUpdateVS();
    const result = valSchema.validate(request.body);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.updateProfile(request.body, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async forgotPassword(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().verifyEmail();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const result = await this.service.forgotPassword(params);
      this.resp.resp(response).send(result);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
 
  public async setPassword(request: WRRequest<undefined, VerifyHash, undefined>, response: Response) {
    const valSchema = new User().getSetPassword();
    const params = request.body;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.setPassword(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async getOpponentUser(request: WRRequest<undefined, getUserForGame, undefined>, response: Response) {
    const valSchema = new User().opponentUserVS();
    const params = request.query;
    const result = valSchema.validate(params);
    if (result.error == null) {
      const currentUser = request.currentUser;
      const resp = await this.service.getUserForGame(params,currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async getCountryList(_, response: Response) {
    try {
      const resp = await this.service.countryList();
      this.resp.resp(response).send(resp);   
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }
  }

  public async userExistence(request: WRRequest<undefined, AuthParams, undefined>, response: Response) {
    try {
      const resp = await this.service.checkSocialLoginUser(request.body);
      this.resp.resp(response).send(resp);   
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }
  }

  public async getNearbyUser(request: WRRequest<undefined, AuthParams, undefined>, response: Response) {
    try {
      const resp = await this.service.getNearByUsers(request.body,request.currentUser);
      this.resp.resp(response).send(resp);   
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }
  }

}
