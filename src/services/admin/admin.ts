import { ServiceReturnVal } from '../../types/common';
import { RespError } from '../../lib/wr_response';
import Base from '../base';
import { page , id } from "../../types/request/user";

import {AdminRepository , UserRepository , GameRepository , GameTurnRepository , ActiveUserRepository } from "../../db/repositories";
// import { IAdmin } from '../../db/models/mongoose/admin';
import utility from '../../lib/utility';
import constants from '../../common/constants';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class GameService extends Base {
  private adminRepo = new AdminRepository();
  private userRepo = new UserRepository();
  private GameRepo = new GameRepository();
  private GameTurnRepo = new GameTurnRepository();
  private ActiveUserRepo = new ActiveUserRepository;

  /**
   * @description Function for login with email and password
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async adminLogin(params: any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};

    // let createObj = {email: 'admin@faceoff.com',username : 'adminfaceoff',type : 'admin',password : '1234'}
    // let created =  await this.adminRepo.create(createObj as any)
    // returnVal.data = { created };
    // return returnVal

    try {
        const user = await this.adminRepo.findOne({ email: params.email });
      

        if(utility.isEmpty(user)) {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
          return returnVal
        }

        if (!utility.isEmpty(user) && user.get('password') !== undefined) {
          const match = bcrypt.compareSync(params.password, user.password);
          console.log(":jwt result match : ", match);
          
          if (!match){
            returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401,constants.ERROR_MESSAGES.INVALID_PASSWORD)
            return returnVal
          };

          const usr = {
            email: user.email,
          };

          const token = jwt.sign(usr, process.env.JWT!);

          returnVal.data = { user, token: token };
          
        } else  returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        
    } catch (error) {
      
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async listAllUsers(params : page): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};

    try {       
      const {page,limit} = params; 

      let users = await this.userRepo.fetchUsers({},{},{},page,limit);
      let usersCount = await this.userRepo.count({});

      returnVal.data = {users, count : usersCount};
        
    } catch (error) {
      
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async userProfileDetails(params : id ): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    try {       
      const {id} = params; 
      let users = await this.userRepo.findOne({_id : id});

      let numberOfGames =  await this.GameRepo.count({
        $or: [{ createdBy: id }, { opponent: id }]
      })

      let easyWins =  await this.GameTurnRepo.getWinTurnsByType(id,'Easy')
      let mediumWins =  await this.GameTurnRepo.getWinTurnsByType(id,'Medium')
      let difficultWins =  await this.GameTurnRepo.getWinTurnsByType(id,'Difficult')
      let totalWins =  await this.GameTurnRepo.count({
        'guessResult.guessBy' : id,
        'guessResult.result' : true,
      })
      
      let gameLose =  await this.GameTurnRepo.count({
        'guessResult.guessBy' : id,
        'guessResult.result' : false,
      })

      let createdByMe = await this.GameRepo.distinctCount('opponent',{createdBy : id})
      let meAsOpponent = await this.GameRepo.distinctCount('createdBy',{opponent : id})

      let stats = {
        totalGames : numberOfGames,
        totalWins,
        totallose : gameLose,
        easyWins,
        difficultWins,
        mediumWins, 
        maxStreak : users.maxStreak,
        coins : users.coins,
        totalFriend : createdByMe + meAsOpponent
      }

      returnVal.data = {users , stats};
        
    } catch (error) {
      
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async getActiveUserGraphData(): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};

    try {       
      let graphData = await this.ActiveUserRepo.getActiveUserGraphData();
      returnVal.data = {graphData};
        
    } catch (error) {
      
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }


}
