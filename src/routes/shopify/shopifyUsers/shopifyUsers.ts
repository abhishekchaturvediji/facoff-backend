import { Router } from 'express';
import ShopifyUserController from '../../../controller/shopify/shopifyUser';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3_helper from '../../../lib/s3_helper';
import constants from '../../../common/constants';

export default class ShopifyUserRoute {
  public router: Router;
  public controller = new ShopifyUserController();

  private upload = multer({
    storage: multerS3({
      s3: s3_helper.s3Client(),
      bucket: constants.AWS_BUCKET_NAME,
      acl: 'public-read',
      key: function (_request, file, cb) {
        const fileName = `${constants.ASSET_FOLDER_PATH.SHOPIFY}/${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
  });

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  routes() {
    this.router.post('/shopify/register-clothing-user',
    this.upload.fields([{ name: 'attachment', maxCount : 2 }]),
    this.controller.registerClothingUser.bind(this.controller))

  }
}
