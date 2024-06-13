import { Router } from 'express';
import AdminController from '../../controller/admin/admin';
export default class UserRoute {
  public router: Router;
  public controller = new AdminController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  routes() {
    this.router.post('/services/admin/login', this.controller.adminLogin.bind(this.controller));
    this.router.get('/admin/users-list', this.controller.allUsers.bind(this.controller));
    this.router.get('/admin/user-profile', this.controller.userProfile.bind(this.controller));
    this.router.get('/admin/active-user-chart-data', this.controller.activeUserData.bind(this.controller));

}

}
