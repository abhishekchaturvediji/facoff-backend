import type {
    TokenUser,
    UserDetails,
    updateProfile,
    VerifyHash,
    getUserForGame
} from '../../types/request/user';
  import {
    UserRepository,
    CodesRepository,
    CountryRepository
  } from '../../db/repositories';
  import { ServiceReturnVal, AuthParams } from '../../types/common';
  import { RespError } from '../../lib/wr_response';
  import { IUser } from '../../db/models/mongoose/user';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import utility from '../../lib/utility';
  import Base from '../base';
  import constants from '../../common/constants';
  import moment from 'moment';
  import Emailer from '../../common/emailer';

  
export default class UserService extends Base {
  private userRepo = new UserRepository();
  private countryRepo = new CountryRepository();
  /**
   * @description Function for registration of users
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async register(params: UserDetails): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser | any> = {};
    
    try {
      const isUser: IUser = await this.userRepo.userByEmaiAllDets(params.email);
      const usernameFound : IUser = await this.userRepo.findOne({username : params.username});

      if(usernameFound){
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_409, constants.ERROR_MESSAGES.USERNAME_NOT_AVAILABLE);
        return returnVal
      }

      if (utility.isEmpty(isUser)) {
        let firstName = '';
        let lastName = '';
        let fullName = '';

        if (params.firstName) {
          firstName = params.firstName;
          if (!params.lastName) {
            const named = params.firstName.split(' ');
            if (named.length > 1) {
              firstName = named[0];
              lastName = named[1];
            }
            fullName = params.firstName;
          } else {
            fullName = `${params.firstName} ${params.lastName}`;
          }
        }
        if (params.lastName) lastName = params.lastName;

        const usr = {
          firstName: firstName,
          lastName: lastName,
          fullName: fullName,
          email: params.email,
          password: params.password,
          fcmToken : params.fcmToken,
          country : params.country,
          dob : params.dob,
          gender  : params.gender,
          username  : params.username,
          coins : 100
        };
         
        if(params.longitude && params.latitude){
          usr['location'] = {
            type: 'Point',
            coordinates: [ params.longitude, params.latitude] // [longitude, latitude]
          }
        }

        const user = await this.userRepo.create(usr as unknown as IUser);

        const token = jwt.sign({...usr,_id : user._id}, process.env.JWT!, { expiresIn: '24h' });
        returnVal.data = { user: user, token: token };

      }else{
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_409, constants.ERROR_MESSAGES.USER_ALREADY_EXIST);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * @description Function for login with email and password
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async login(params: UserDetails): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    
    try {
        const user = await this.userRepo.findOne({ email: params.email });
        // eslint-disable-next-line no-console
        // If user exists
        if(utility.isEmpty(user)) {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
          return returnVal
        }

        if (user.type !== constants.ENUMS.LOGIN_TYPE.CUSTOM && user.get('password') === undefined) {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_400,constants.ERROR_MESSAGES.FORGOT_PASSWORD_REQUEST);
        } else if (!utility.isEmpty(user) && user.get('password') !== undefined) {
          const match = bcrypt.compareSync(params.password, user.password);
          console.log(":jwt result match : ", match);
          
          if (!match){
            returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401,constants.ERROR_MESSAGES.INVALID_PASSWORD)
            return returnVal
          };

          const usr = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            photo: user.photo,
            country : user.country
          };

          const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });
          const _updateUser = {
            lastActivity: new Date(),
            fcmToken : params.fcmToken,
          };
          
          if(params.longitude && params.latitude){
            _updateUser['location'] = {
              type: 'Point',
              coordinates: [ params.longitude, params.latitude] // [longitude, latitude]
            }
          }

          user.lastActivity = new Date();
          user.fcmToken = params.fcmToken;
          this.userRepo.updateById(user._id, _updateUser);

          returnVal.data = { user, token: token };
          
        } else  returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        
    } catch (error) {
      
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  
  /**
   * @description Function for changing password
   * @param {changePassword}
   * @returns {ServiceReturnVal}
   */
  public async updateProfile(params: updateProfile, user: TokenUser): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {
      const usr = await this.userRepo.findById(user._id);

      if(utility.isEmpty(usr)) {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        return  returnVal
      }

      //If user exists
      usr.lastActivity = new Date();
      usr.save();

      let updateObj = {
        firstName : params.firstName , 
        lastName : params.lastName
      }
      
      if(params.oldPassword ||  params.password){
        const oldPasswordMatch = await bcrypt.compare(params.oldPassword, usr.password);
        const newPasswordMatch = await bcrypt.compare(params.password, usr.password);
        if (!oldPasswordMatch) { returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_422,constants.ERROR_MESSAGES.PASSWORD_NOT_MATCHED )} 
        else if (newPasswordMatch) {returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_422, constants.ERROR_MESSAGES.SAME_OLD_PASSWORD)} 
        updateObj['password'] = await bcrypt.hash(params.password, 10);
      }

      let data = await this.userRepo.updateById(user._id, updateObj);
      returnVal.data = data ;
      
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
      return returnVal;
    }
    return returnVal;
  }

  /**
   * @description Function for update user profile
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async update(params: UserDetails, user: TokenUser): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const usr = await this.userRepo.findOne({ _id: user._id });
      if (!utility.isEmpty(usr)) {
        returnVal.data = await this.userRepo.update(usr._id, params as unknown as IUser);
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * @description Function for social auth (google and facebook)
   * @param {AuthParams} 
   * @returns {ServiceReturnVal}
   */
  public async socialLogin(params: AuthParams): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {

      let user = await this.userRepo.updateByEmail(params.email, {
        photo: params.photo,
        lastActivity: new Date(),
      } as unknown as IUser); 

      // if a new user
      if (utility.isEmpty(user)) {
        
        // check if username already exist
        const usernameFound : IUser = await this.userRepo.findOne({username : params.username});
        
        if(usernameFound){
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_409, constants.ERROR_MESSAGES.USERNAME_NOT_AVAILABLE);
          return returnVal
        }

        let userObj = {
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          fullName: params.lastName ? `${params.firstName} ${params.lastName}` : params.firstName,
          photo: params.photo,
          type: params.type,
          socialId : params.socialId,
          lastActivity: new Date(),
          fcmToken : params.fcmToken,
          username : params.username,
          dob : params.dob,
          gender : params.gender,
          country : params.country,
          password : params.password,
          coins : 100
        }

        if(params.longitude && params.latitude){
          userObj['location'] = {
            type: 'Point',
            coordinates: [ params.longitude, params.latitude] // [longitude, latitude]
          }
        }

        user = await this.userRepo.create(userObj as unknown as IUser);
      }

      const usr = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        photo: user.photo,
        socialId : params.socialId, 
        fcmToken : params.fcmToken,
        country : params.country,
      };

      if(params.longitude && params.latitude){
        usr['location'] = {
          type: 'Point',
          coordinates: [ params.longitude, params.latitude] // [longitude, latitude]
        }
      }

      const _updateUser = {lastActivity: new Date(), fcmToken : params.fcmToken};
      this.userRepo.updateById(user._id, _updateUser);
      const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });
      returnVal.data = { user, token: token };

    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to send reset password link
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async forgotPassword(params: UserDetails): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codesRepo = new CodesRepository();
      const user = await this.userRepo.findOne({ email: params.email });

      if(utility.isEmpty(user)){  
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        return returnVal
      }

      await codesRepo.deactiveOldCodes(params.email, constants.ENUMS.HASH_TYPES.RESET_PASSWORD);
      const hash = utility.hash(12);
      await codesRepo.add(hash, constants.ENUMS.HASH_TYPES.RESET_PASSWORD, undefined, params.email);
      const varsToReplace = {
        hash: hash,
        url: `${process.env.DEEPLINK_ANDROID}${constants.DEEPLINK_PATH.RESET_PASSWORD}/`,
      };
      console.log(" here we are : " ,varsToReplace );
      
      // send email
      await Emailer.sendMail(params.email,constants.NODEMAILER.MAIL_SUBJECT.PASSWARD_CHANGE,constants.NODEMAILER.MAIL_TEMPLATE.CHANGE_PASSWORD,varsToReplace);
      returnVal.data = constants.SUCCESS_MESSAGES.EMAIL_SEND;

    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to set the password
   *
   * @param {VerifyHash}
   * @returns {ServiceReturnVal}
   */
  public async setPassword(params: VerifyHash): Promise<ServiceReturnVal<string>> {
    let returnVal: any = {};
    try {
      const codesRepo = new CodesRepository();
      const codes = await codesRepo.findOne({ code: params.hash, type: params.type });
      if (!utility.isEmpty(codes)) {
        const createdTime = moment.utc(codes.createdAt);
        const currentTime = moment().utc();
        const diffInTime = currentTime.diff(createdTime, 'hours');
        const expiresIn = constants.ENUMS.HASH_EXPIRES_IN.DEFAULT_EXPIRY;
        if (diffInTime <= expiresIn) {
          const setParams = {};
          if (params.password) {
            const password = await bcrypt.hash(params.password, 10);
            setParams['password'] = password;
          }
        
          await this.userRepo.updateByEmail(codes.email, setParams as unknown as IUser);
          const user = await this.userRepo.findOne({ email: codes.email });
          const usr = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            photo: user.photo,
          };
          user.password = undefined;

          const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });
          user.lastActivity = new Date();
          user.save();
          returnVal['data'] = { user, token: token };
        } else {
          returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_410, constants.ERROR_MESSAGES.HASH_EXPIRED);
        }
        await codesRepo.deactiveCode(params.hash);
      } else {
        returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.HASH_NOT_FOUND);
      }
    } catch (error) {
      returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async getUserForGame(params: getUserForGame,currentUser:TokenUser): Promise<ServiceReturnVal<string>> {
    let returnVal: any = {};
    try {
      const { type, value } = params;

      let user;
      if (type === constants.USER_SELECION_TYPES.RANDOM) {
        const users = await this.userRepo.aggregate([
          { $match: { _id: { $ne: this.userRepo.toObjectId(currentUser._id)} } },
          { $sample: { size: 1 } },
          { $project: { _id: 1, email: 1, fullName: 1, photo: 1 } },
        ]);
        user = users;
      } else if (type === constants.USER_SELECION_TYPES.EMAIL || type === constants.USER_SELECION_TYPES.USERNAME) {

        const fieldName = type === constants.USER_SELECION_TYPES.EMAIL ? constants.USER_SELECION_TYPES.EMAIL : constants.USER_SELECION_TYPES.USERNAME;
        user = await this.userRepo.find(
          { 
            _id : { $ne : this.userRepo.toObjectId(currentUser._id) }, 
            [fieldName]: { $regex: new RegExp(value, 'i') } 
          },
          { _id: 1, email: 1, fullName: 1, photo: 1 }
        );
      }
      
      returnVal.data = { user };
    } catch (error) {
      returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async countryList(): Promise<ServiceReturnVal<string>> {
    let returnVal: any = {};
    try {
      let countryList = await this.countryRepo.find({});
      returnVal.data = { countryList };
    } catch (error) {
      returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async checkSocialLoginUser(params: AuthParams): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {
      let userAvailable = false;
      let user = {} as IUser;
      if(params.email) user = await this.userRepo.findOne({email : params.email});
      else{  
        // for facebook login use case | bcz it does not provide the email 
        user = await this.userRepo.findOne({socialId : params.socialId});
      }

      if(!utility.isEmpty(user)) {

        const usr = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          photo: user.photo,
          socialId : params.socialId, 
          fcmToken : params.fcmToken,
          country : user.country,
        };

        if(params.longitude && params.latitude){
          usr['location'] = {
            type: 'Point',
            coordinates: [ params.longitude, params.latitude] // [longitude, latitude]
          }
        }

        const _updateUser = {lastActivity: new Date(), fcmToken : params.fcmToken};

          if(params.longitude && params.latitude){
            _updateUser['location'] = {
              type: 'Point',
              coordinates: [ params.longitude, params.latitude] // [longitude, latitude]
            }
          }

        this.userRepo.updateById(user._id, _updateUser);
        const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });
        returnVal.data = { user, token: token };


        userAvailable = true
      };
      returnVal.data =  {userAvailable ,...returnVal.data};
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  public async getNearByUsers(params: getUserForGame,currentUser:TokenUser): Promise<ServiceReturnVal<string>> {
    let returnVal: any = {};
    try {
      // const { type, value } = params;
      console.log("params : ", params);
      
      const user = await this.userRepo.findById(currentUser._id);
      const latitude = user.location.coordinates[1];
      const longitude = user.location.coordinates[0];

      if(!longitude || !latitude){
        returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_400, constants.ERROR_MESSAGES.LOCATION_PERMISSION_DENIED);
      }

      let data = await this.userRepo.getUsersWithinRadius(this.userRepo.toObjectId(currentUser._id),latitude,longitude,1000)
      
      returnVal.data = { data };
    } catch (error) {
      returnVal['error'] = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
  
}
  