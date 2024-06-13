import { createLogger, transports, format } from 'winston'; // Import mongodb
import { MongoDBConnectionOptions } from 'winston-mongodb';
import 'winston-mongodb';

// const connectUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?authMechanism=DEFAULT`;
const connectUrl = `mongodb://0.0.0.0:27017/faceoff`;

const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, metadata }) => {
          return `## =>> [${timestamp}] ${level}: ${message}. ${JSON.stringify(metadata)}`;
        })
      ),
    }),
    new transports.File({
      dirname: 'logs',
      filename: 'server-detailed.log',
      format: format.combine(format.json()),
    }),
    new transports.File({
      dirname: 'logs',
      filename: 'server.log',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
      ),
    }),

    new transports.MongoDB({
      level: 'error',
      //mongo database connection link
      db: connectUrl,
      tryReconnect: true,
      options: {
        useUnifiedTopology: true,
      },
      dbName: process.env.DB,
      // A collection to save json formatted logs
      collection: 'server_logs',
      format: format.combine(
        format.timestamp(),
        // Convert logs to a json format
        format.json()
      ),
    } as MongoDBConnectionOptions),
  ],
  format: format.combine(format.metadata(), format.timestamp()),
});
export { logger };
