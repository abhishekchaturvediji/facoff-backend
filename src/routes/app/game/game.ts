import { Router } from 'express';
import gameController from '../../../controller/app/game';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3_helper from '../../../lib/s3_helper';
import constants from '../../../common/constants';

export default class GameRoute {
  public router: Router;
  public controller = new gameController();

  private upload = multer({
    storage: multerS3({
      s3: s3_helper.s3Client(),
      bucket: constants.AWS_BUCKET_NAME,
      acl: 'public-read',
      key: function (_request, file, cb) {
        const fileName = `${constants.ASSET_FOLDER_PATH.FACEOFF_GAME}/${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
  });

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  routes() {
    this.router.post('/game/create-game',
    this.upload.fields([{ name: 'media', maxCount : 1 }]),
    this.controller.createGame.bind(this.controller))

    this.router.post('/game/create-next-turn',
    this.upload.fields([{ name: 'media', maxCount : 1 }]),
    this.controller.createNextTurn.bind(this.controller))

    this.router.get('/game/get-list',this.controller.getGames.bind(this.controller))
    this.router.post('/game/guess-turn',this.controller.guessTurn.bind(this.controller))
    this.router.get('/game/get-turn-data',this.controller.turnData.bind(this.controller))
    this.router.get('/game/get-leaderboard',this.controller.getLeaderboard.bind(this.controller))
    this.router.get('/game/get-statistics',this.controller.getStats.bind(this.controller))

    this.router.post('/game/use-lifeline',this.controller.useLifeline.bind(this.controller))

  }
}
