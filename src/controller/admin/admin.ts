import adminService from '../../services/admin/admin';
import WRRequest from '../../lib/wr_request';
import { Response } from 'express';
import {
  login,
  page,
  id
} from '../../types/request/user';
import { RespError, WRResponse } from '../../lib/wr_response';
import User from '../../validations/user/user';
// import { AuthParams } from '../types/common';


export default class GameController {
  private service = new adminService();
  private resp = new WRResponse();
  
  public async adminLogin(request: WRRequest<undefined, login, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new User().getLoginOnlyVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      // const currentUser = request.currentUser;
      const resp = await this.service.adminLogin(params)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }  

  public async allUsers(request: WRRequest<undefined, page, undefined>, response: Response){ 
    const params = request.query;
    const resp = await this.service.listAllUsers(params)
    this.resp.resp(response).send(resp);
  }
  
  public async activeUserData(_request: WRRequest<undefined, undefined, undefined>, response: Response){ 
    const resp = await this.service.getActiveUserGraphData()
    this.resp.resp(response).send(resp);
  }

  public async userProfile(request: WRRequest<undefined, id, undefined>, response: Response){ 
    const params = request.query;
    const valSchema = new User().getIdVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.userProfileDetails(params)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }

  }

}
