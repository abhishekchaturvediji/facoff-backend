import { ServiceReturnVal } from '../../types/common';
import { RespError } from '../../lib/wr_response';
import Base from '../base';
import constants from '../../common/constants';
import { TokenUser } from "../../types/request/user";
import { createGame , guessTurn , createGameTurn } from "../../types/request/game";
import { NotificationRepository , UserRepository , GameTurnRepository , GameRepository } from "../../db/repositories";

import { IGame } from '../../db/models/mongoose/game';
import { IGameTurns } from '../../db/models/mongoose/game_turn';
import { INotification } from '../../db/models/mongoose/notification';
import AppFunction from "../../lib/app_functions";
import { Notification } from '../../types/request/notification';
import Emotion from '../../db/models/mongoose/emotion';

export default class GameService extends Base {
    private GameRepo = new GameRepository();
    private GameTurnRepo = new GameTurnRepository();
    private NotificationRepo = new NotificationRepository();
    private UserRepo = new UserRepository();
    private AppFunctionRepo = new AppFunction()

  /**
   * @description Function for registration of new game
   * @param 
   * @returns 
   */
  public async createGame(params:createGame ,currentUser:TokenUser): Promise<ServiceReturnVal<Object>> {

    const returnVal: ServiceReturnVal<Object> = {};
    
    // get opponent details 
    let opponentDetails = await this.UserRepo.findById(params.opponent)

    // check if the opponent is valid
    if(!opponentDetails || params.opponent == currentUser._id) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404 , constants.ERROR_MESSAGES.OPPONENT_NOT_FOUND);
      return returnVal
    }

    // prepare game object 
    let game = <IGame> {
      createdBy : this.GameRepo.toObjectId(currentUser._id) ,
      opponent: this.GameRepo.toObjectId(params.opponent) ,
      turnCount : 1,
    }; 

    // prepare turn object
    let turn = {
      turnBy : currentUser._id,
      emotionSelectedId :  params.emotionSelectedId,
      emotionSelectedName : params.emotionSelectedName ,
      mediaPath: params.files['media'][0].location,
      comment: params.comment 
    }

    // create the game update the turn
    let createdGame = await this.GameRepo.create(game as unknown as IGame)
    let gameTurn = await this.GameTurnRepo.create(turn as unknown as IGameTurns)    

    // update game with turn id
    await this.GameRepo.updateOne(createdGame._id ,{ $set: { turns: [gameTurn._id] } });

    // creat app notification 
    let notification = <INotification> {
      notification_to : this.GameRepo.toObjectId(params.opponent)  , 
      title : constants.NOTIFICATION_TITILES.NEW_GAME_STARTED ,
      message : `${currentUser.firstName} ${currentUser.lastName} has started a new game with you !` ,    
      type : constants.NOTIFICATION_TYPES.GAME_STRATED , 
    }
    this.NotificationRepo.create(notification as unknown as INotification)

    // create a push notification 
    let pushNotificationObj = <Notification> {
      title : constants.NOTIFICATION_TITILES.NEW_GAME_STARTED ,
      message : `${currentUser.firstName} ${currentUser.lastName} has started a new game with you !`,
      notification_type : constants.NOTIFICATION_TYPES.GAME_STRATED ,
      user_id : params.opponent
    }

    // send the notification if the oppoent has fcmToken  
    if(opponentDetails.fcmToken) this.AppFunctionRepo.pushNotification(pushNotificationObj,opponentDetails.fcmToken)

    if (!createdGame) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.NO_EMOTION_FOUND);
      return returnVal
    }

    returnVal.data = { game };
    return returnVal
  }

  public async getGames(currentUser:TokenUser): Promise<ServiceReturnVal<Object>> {

    const returnVal: ServiceReturnVal<Object> = {}; 
    const userId = this.GameRepo.toObjectId(currentUser._id) ;
    
    const games : any = await this.GameRepo.getMyGames(userId);
  
    const gamesWithTurn = games.map((game) => {
      let myTurn;
      let turnText = 'Guess';
      game.game.turns?.turnBy.equals(currentUser._id) ? myTurn = false : myTurn = true ;
      if(game.game.turns?.guessResult?.emotionSelectedName) turnText = 'Play';

      return { game : game.game, myTurn , turnText };
    });

    returnVal.data = { gamesWithTurn };
    return returnVal
  }

  public async guessTurn(params:guessTurn,currentUser:TokenUser): Promise<ServiceReturnVal<Object>> {

    const returnVal: ServiceReturnVal<Object> = {};

    console.log(" params : ", params , currentUser);
    
    const turnId = params.turnId;
    
    // check if the user is creator or opponent
    let gameDetails = await this.GameRepo.findOne({
        $and : [
          {
            $or: [{ createdBy: currentUser._id }, { opponent: currentUser._id }], 
          },
          { turns: turnId }
        ]
      }
    )
    
    if(!gameDetails){
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_403, constants.ERROR_MESSAGES.GAME_DOES_NOT_BELONG_TO_YOU);
      return returnVal
    }

    const turn : any = await this.GameTurnRepo.findById(turnId);
  
    // check if the turn is valid | and is still incomplete
    if(!turn || turn.guessResult.selectedEmotionId) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404 , constants.ERROR_MESSAGES.INVALID_TURN);
      return returnVal
    }

    let emotionDetails : any = await Emotion.findById(turn.emotionSelectedId).populate('category');

    turn.guessResult = {
      result : params.result ,
      selectedEmotionId : params.emotionSelectedId ,
      emotionSelectedName: params.emotionSelectedName,
      comment : params.comment ,
      guessBy : currentUser._id ,
      rewardCoins : emotionDetails.category.rewardCoin 
    }

    // updating the streak or breaking it 
    let key = '';
    let user = '';
    JSON.stringify(gameDetails.createdBy) == JSON.stringify(this.GameRepo.toObjectId(currentUser._id)) ?  (key = 'createByConfig', user = 'createdBy' ) : (key = 'opponentConfig', user = 'opponent');

    if(params.result){
      gameDetails[key]['currentStreak'] = gameDetails[key]['currentStreak'] + 1; 
      if(gameDetails[key]['currentStreak'] > gameDetails[key]['longestStreak']) gameDetails[key]['longestStreak'] = gameDetails[key]['currentStreak'];
    }else  gameDetails[key]['currentStreak'] = 0 ;

    await gameDetails.save();
    
    
    let userDetails = await this.UserRepo.findById(gameDetails[user])
    

    if(gameDetails[key]['longestStreak'] > userDetails['maxStreak']) userDetails['maxStreak'] = gameDetails[key]['longestStreak']
    userDetails['coins'] = userDetails['coins'] + emotionDetails.category.rewardCoin;
    await userDetails.save()


    let turnResult = await turn.save()
  
    returnVal.data = { turnResult };
    return returnVal
  }
  
  public async createNextTurn(params:createGameTurn ,currentUser:TokenUser): Promise<ServiceReturnVal<Object>> {

    const returnVal: ServiceReturnVal<Object> = {};
    
    const userId = currentUser._id;
    // get opponent details 
    let gameDetails = await this.GameRepo.findById(params.gameId)

    // check if the opponent is valid
    if(!gameDetails) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404 , constants.ERROR_MESSAGES.GAME_NOT_FOUND);
      return returnVal
    }

    const isCreatedByMe = gameDetails.createdBy && gameDetails.createdBy._id.equals(userId);
    const isOpponentMe = gameDetails.opponent && gameDetails.opponent._id.equals(userId);
    let opponent = (isCreatedByMe ? gameDetails.opponent._id : gameDetails.createdBy._id);
    
    const myTurn = (isCreatedByMe && gameDetails.turns.length % 2 === 0) || (isOpponentMe && gameDetails.turns.length % 2 !== 0);

    if(!myTurn) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404 , constants.ERROR_MESSAGES.NOT_YOUR_TURN);
      return returnVal
    }

    // prepare turn object
    let turn = {
      turnBy : this.GameRepo.toObjectId(currentUser._id),
      emotionSelectedId :  this.GameRepo.toObjectId(params.emotionSelectedId),
      emotionSelectedName : params.emotionSelectedName ,
      mediaPath: params.files['media'][0].location,
      comment: params.comment,
    }

    // create the game update the turn
    let gameTurn = await this.GameTurnRepo.create(turn as unknown as IGameTurns)    

    // update game with turn id
    await this.GameRepo.updateOne(params.gameId ,{ $push: { turns: [gameTurn._id]  } , $inc: { turnCount: 1 } });

    // creat app notification 
    let notification = <INotification> {
      notification_to : this.GameRepo.toObjectId(params.opponent)  , 
      title : constants.NOTIFICATION_TITILES.ITS_YOUR_TURN ,
      message : `${currentUser.firstName} ${currentUser.lastName} has completed his turn , start guessing and complete your turn !` ,    
      type : constants.NOTIFICATION_TYPES.TURN_CREATED , 
    }
    await this.NotificationRepo.create(notification as unknown as INotification)

    // create a push notification 
    let pushNotificationObj = <Notification> {
      title : constants.NOTIFICATION_TITILES.ITS_YOUR_TURN ,
      message : `${currentUser.firstName} ${currentUser.lastName} has completed his turn , start guessing and complete your turn !`,
      notification_type : constants.NOTIFICATION_TYPES.TURN_CREATED ,
      user_id : opponent as unknown
    }

    let oppoent = await this.UserRepo.findById(opponent as any);

    // send the notification if the oppoent has fcmToken  
    if(oppoent.fcmToken) this.AppFunctionRepo.pushNotification(pushNotificationObj,oppoent.fcmToken)

    if (!gameTurn) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.COULD_NOT_CREATE_TURN);
      return returnVal
    }

    returnVal.data = { gameTurn };
    return returnVal
  }

  public async getTurnData(params:any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    const { turnId } = params;
    // Find turn data by turnId
    const turn = await this.GameTurnRepo.findById(turnId);

    if (!turn) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.TURN_NOT_FOUND);
      return returnVal
    }

    // Return turn data
    returnVal.data = { turn };
    return returnVal
  }

  public async getLeaderboard(currentUser : TokenUser,param): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    const {_id,country} = currentUser;
    if(param.type == constants.LEADER_BOARD_FILTER.friends){
    
      // Find friends based on createdBy
      const createdByFriends = await this.GameRepo.getMyGamesList(_id) as [];

      let id = [];
      createdByFriends.map(d => {
        id.push(JSON.parse(JSON.stringify(d['createdBy'])))
        id.push(JSON.parse(JSON.stringify(d['opponent'])))
      })
      
      // Combine and deduplicate friend IDs
      const friendIds = Array.from(new Set([...id]));
      
      const friendsLeaderboard = await this.UserRepo.sortAndSelect(friendIds,'desc')
  
      // Return turn data
      returnVal.data = { friendsLeaderboard };
      return returnVal
    }else if(param.type == constants.LEADER_BOARD_FILTER.country){
        // Find friends based on createdBy
        const friendsLeaderboard = await this.UserRepo.sortAndSelectWithCountry(country)
        // Return turn data
        returnVal.data = { friendsLeaderboard };
        return returnVal
    }else{
      let friendsLeaderboard = await this.UserRepo.findAndSort()
      returnVal.data = { friendsLeaderboard };
      return returnVal
    }
  }

  public async getStats(currentUser : TokenUser): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    const {_id} = currentUser;
    
      // Find friends based on createdBy
      const user = await this.UserRepo.findById(_id);
      let coins = user.coins;
      let streak = user.maxStreak;

      let numberOfGames =  await this.GameRepo.count({
        $or: [{ createdBy: _id }, { opponent: _id }]
      })

      let easyWins =  await this.GameTurnRepo.getWinTurnsByType(_id,'Easy')
      let gameLose =  await this.GameTurnRepo.count({
        'guessResult.guessBy' : _id,
        'guessResult.result' : false,
      })

      // Return turn data
      returnVal.data = { coins , streak , numberOfGames , easyWins ,gameLose };
      return returnVal
    
  }

  public async reduceCoins(currentUser : TokenUser ,  lifeline : any): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    const {_id} = currentUser;
    
      // Find friends based on createdBy
      const user = await this.UserRepo.findById(_id);
      let reduceCoin = constants.LIFELINE_TYPE[lifeline.lifelineType];
      if(user.coins < reduceCoin){
        returnVal.error = 
        new RespError(constants.RESP_ERR_CODES.ERR_404,constants.ERROR_MESSAGES.INSUFFICIENT_COINS);
        return returnVal
      }

      user.coins -= reduceCoin;
      await user.save()

      // Return turn data
      returnVal.data = { allow : true };
      return returnVal
    
  }


}
