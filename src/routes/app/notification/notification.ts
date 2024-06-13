import { Router } from 'express';
import NotificationController from '../../../controller/app/notification';
// import s3Helper from '../../lib/s3_helper';
// import multer from 'multer';
// import multerS3 from 'multer-s3';


export default class UserRoute {
  public router: Router;
  public controller = new NotificationController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  routes() {

    this.router
        .route('/notification')
        .get(this.controller.getAllNotifications.bind(this.controller))
        .delete(this.controller.deleteNotification.bind(this.controller))
        .patch(this.controller.markOneNotificationasread.bind(this.controller));

    this.router.put('/notification/mark-all-as-read',this.controller.markAllNotificationasread.bind(this.controller))

    // this.router
    //     .route('/all')
    //     .delete(notificationController.deleteAllNotifications)
    //     .patch(notificationController.markAllNotificationsAsRead);

  }
}
