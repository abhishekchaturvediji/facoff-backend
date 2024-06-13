import { Router } from 'express';
import EmotionController from '../../../controller/app/emotion';
// import s3Helper from '../../lib/s3_helper';
// import multer from 'multer';
// import multerS3 from 'multer-s3';


export default class UserRoute {
  public router: Router;
  public controller = new EmotionController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  routes() {

    this.router
        .route('/emotions')
        .get(this.controller.getEmotions.bind(this.controller))

    // this.router
    //     .route('/all')
    //     .delete(notificationController.deleteAllNotifications)
    //     .patch(notificationController.markAllNotificationsAsRead);

  }
}
