import {  Request ,Response , NextFunction  } from 'express';
import { UserRepository , ActiveUserRepository} from "../db/repositories";  

export async function updateUserActivity(req: Request, _res: Response, next: NextFunction){
  if (req.originalUrl.startsWith('/admin')) return next()
  const currentUser = req['currentUser'];
  if (currentUser?._id) {
    await new UserRepository().updateById(currentUser._id,{lastActivity : Date.now()})
    await new ActiveUserRepository().updateUserActivity(currentUser._id)
  }
  next(); 
}