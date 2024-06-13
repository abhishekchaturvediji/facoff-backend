import { ObjectId } from 'mongoose';

export  interface  Notification {
  title? : string,
  message? : string,
  notification_type? : string,
  user_id? : string | ObjectId
}



export  interface  markAsRead {
  notificationId ? : string,
}
