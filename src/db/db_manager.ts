import mongoose, { Mongoose } from 'mongoose';
import constants from '../common/constants';


interface DBConfig {
    url: string;
    username: string;
    password: string;
    db: string;
    debug: boolean;
  }
  
  export class DBManaager {
    public static connection: Mongoose;
    public static async connect(config: DBConfig) {
      if (mongoose.connection.readyState == 0) {
        console.log(" : ${config.url} ", config.url);
        
        mongoose.set('debug', config.debug);
        const url: string = `${config.url}`;
        this.connection = await mongoose.connect(url, {
          dbName: config.db,
          auth: { username: config.username, password: config.password },
        });
        const state = Number(mongoose.connection.readyState);
        console.log('DB Connection : ' + constants.DB_STATES.find((f) => f.value == state).label);
      } else  return this.connection;
      
    }
  
    public static debug(debug: any) {
      mongoose.set('debug', debug);
    }
  }
  