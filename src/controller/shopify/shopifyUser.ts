import ShopifyUserService from '../../services/shopify/shopifyUser';
import WRRequest from '../../lib/wr_request';
import { Response } from 'express';
import { WRResponse } from '../../lib/wr_response';


export default class ShopifyUserController {
  private service = new ShopifyUserService();
  private resp = new WRResponse();
  
  public async registerClothingUser(request : WRRequest<undefined, undefined, undefined>, response: Response) {
      let params : any = request.body;
      params.files = request.files;
      const resp = await this.service.registerClothingUser(params);
      this.resp.resp(response).send(resp);
  }

}
