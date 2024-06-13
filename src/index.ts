import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './routes';
import { expressjwt } from 'express-jwt';
import { DBManaager } from './db/db_manager';
import { updateUserActivity } from "./middlewares";

global.__basedir = `${__dirname}/`
export class ApiServer {
  public app: express.Application;
  private PORT;
  // private resp = new TPCResponse();

  constructor() {
    dotenv.config()
    this.PORT = process.env.PORT || 8080;
    this.app = express();
    this.configureJWT();
    this.config();
    this.routes();
  }

  public async config() {
    
    // this.app.use('/services/webhook', express.raw({ type: '*/*' }));
    this.app.use(express.json());
    // this.app.use(compression());
    this.app.set('view engine', 'ejs')
    this.app.use(cors());
    this.app.use(express.json({ limit: '30mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '30mb' }));
    this.app.use(express.static('public'));
    // the below middleware updates the user lastActivity and the pushed into active user's
    this.app.use(updateUserActivity as any);
  }

  public configureJWT() {
    const publicRoutes = [/\/media\/*/, /\/services\/*/, /\/api-doc\/*/,/\/shopify\/*/];
    this.app.use(
      expressjwt({
        secret: process.env.JWT! || 'defaultSecret', // Provide a valid secret or use a default value
        algorithms: ['HS256'],
        requestProperty: 'currentUser',
      }).unless({ path: publicRoutes })
    );
  }

  public routes() {
    this.app.use('/',router);
  }

  public async start() {
    // connecting db
    // eslint-disable-next-line no-console

    await DBManaager.connect({
      db: process.env.DB,
      url: process.env.DB_URL,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      debug: process.env.DB_DEBUG == 'true' ? true : false,
    });

    this.app.listen(this.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server started at http://localhost:${this.PORT}`);
    });
  }
}

const apiServer = new ApiServer();
apiServer.start();


