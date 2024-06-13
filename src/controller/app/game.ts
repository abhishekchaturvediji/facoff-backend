import gameService from '../../services/app/game';
import Game from '../../validations/game/game';
import WRRequest from '../../lib/wr_request';
import { Response } from 'express';
import {
  createGame, guessTurn , turnData  ,createGameTurn , lifelineType
} from '../../types/request/game';
import { RespError, WRResponse } from '../../lib/wr_response';
// import { AuthParams } from '../types/common';

export default class GameController {
  private service = new gameService();
  private resp = new WRResponse();
  
  public async createGame(request: WRRequest<undefined, createGame, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Game().getCreateGameVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      params.files = request.files;  
      const currentUser = request.currentUser;
      const resp = await this.service.createGame(params,currentUser)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }  

  public async createNextTurn(request: WRRequest<undefined, createGameTurn, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Game().getNextTurnVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      params.files = request.files;  
      const currentUser = request.currentUser;
      const resp = await this.service.createNextTurn(params,currentUser)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }  

  public async getGames(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    try {
      const resp = await this.service.getGames(currentUser)
      this.resp.resp(response).send(resp);
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }
  }  

  public async guessTurn(request: WRRequest<undefined, guessTurn , undefined>, response: Response) {
    const params = request.body;
    console.log("guessTurn : controller : ",params );
    
    const valSchema = new Game().getGuessTurnVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const currentUser = request.currentUser;
      const resp = await this.service.guessTurn(params,currentUser)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }  

  public async turnData(request: WRRequest<undefined, turnData , undefined>, response: Response) {
    const params = request.query;
    const valSchema = new Game().getTurnData();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.getTurnData(params)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }  

  public async  getLeaderboard(request: WRRequest<undefined, undefined , undefined>, response: Response) {
    const currentUser = request.currentUser;
    const param = request.query;
    try {
      const resp = await this.service.getLeaderboard(currentUser,param)
      this.resp.resp(response).send(resp);
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }
  }  

  public async  getStats(request: WRRequest<undefined, undefined , undefined>, response: Response) {
    const currentUser = request.currentUser;
    try {
      const resp = await this.service.getStats(currentUser)
      this.resp.resp(response).send(resp);
    } catch (error) {
      this.resp.resp(response).error(RespError.validation(error.message));
    }
  }  

  public async useLifeline(request: WRRequest<undefined, lifelineType , undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Game().getLifeLineVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const currentUser = request.currentUser;
      const resp = await this.service.reduceCoins(currentUser,params)
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }  

  
}
