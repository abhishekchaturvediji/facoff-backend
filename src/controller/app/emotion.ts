import EmotionService from '../../services/app/emotion';
// import User from '../validations/user/user';
import WRRequest from '../../lib/wr_request';
import { Response } from 'express';
// import {
//   UserDetails,
//   // changePassword,
//   VerifyHash,
//   updateProfile
// } from '../types/request/user';
import { WRResponse } from '../../lib/wr_response';
// import { AuthParams } from '../types/common';


export default class EmotionController {
  private service = new EmotionService();
  private resp = new WRResponse();
  
  public async getEmotions(request: WRRequest<undefined, undefined, undefined>, response: Response) {
      console.log(request.body);
      const resp = await this.service.getEmotions();
      this.resp.resp(response).send(resp);
  }

}
