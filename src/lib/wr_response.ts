import { Response } from 'express';
import { ServiceReturnVal } from '../types/common';

import fs from 'fs';
import path from 'path';
import utility from './utility';
import constants from '../common/constants';
import { logger } from '../common/logger';

export class RespError extends Error {
  public code: number = 0;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }

  public static unauthenticate(
    message: string = 'Unauthenticated',
    code: number = constants.RESP_ERR_CODES.ERR_401
  ): Error {
    return new RespError(code, message);
  }

  public static validation(message: string, code: number = constants.RESP_ERR_CODES.ERR_400): Error {
    return new RespError(code, message);
  }

  public static unauthoriedAction(message: string = constants.ERROR_MESSAGES.NOT_AUTHORISED): Error {
    return new RespError(constants.RESP_ERR_CODES.ERR_422, message);
  }
}

export class WRResponse {
  private response?: Response;

  public resp(response: Response) {
    this.response = response;
    return this;
  }

  public send(data: ServiceReturnVal<any>) {
    if (data.error) {
      this.response!.status((data.error as RespError).code).json({ error: data.error.message });
    } else {
      this.response!.json(data);
    }
  }

  public sendFile(data: ServiceReturnVal<any>) {
    logger.info('~ file: wr_response.ts:51 ~ WRResponse ~ sendFile');
    if (data.error) {
      logger.error(`~ file: wr_response.ts:53 ~ WRResponse ~ sendFile ~ error" ${JSON.stringify(data.error)}`);
      this.response!.status((data.error as RespError).code).json({ error: data.error.message });
    } else {
      try {
        logger.info('~ file: wr_response.ts:57 ~ WRResponse ~ sendFile ~ entered inside try');
        var file = fs.createReadStream(data.filePath!);
        logger.info(`~ file: wr_response.ts:58 ~ WRResponse ~ sendFile ~ file' ${file}`);
        var headers = {
          'Content-disposition': `attachment;filename=${path.basename(data.filePath!)}`,
        };
        headers['filename'] = path.basename(data.filePath!);
        headers['Cache-Control'] = 'no-cache';
        if (!utility.isEmpty(data.mimeType)) {
          logger.info(`~ file: wr_response.ts:64 ~ WRResponse ~ sendFile ~ data.mimeType" ${data.mimeType}`);

          headers['Content-type'] = data.mimeType;
        }

        this.response!.writeHead(200, headers);
        file.pipe(this.response!);
        logger.info(`~ file: wr_response.ts:71 ~ WRResponse ~ sendFile ~ pipe" ${this.response}`);

        file.on('close', function () {
          logger.info(
            '~ file: wr_response.ts:74 ~ WRResponse ~ sendFile ~ entered in on(close) function to unlinkSync'
          );
          // fs.unlinkSync(data.filePath!);
          logger.info(
            `~ file: wr_response.ts:79 ~ WRResponse ~ sendFile ~ entered in on(close) function to unlinkSync ${data.filePath}`
          );
        });

        file.on('error', (error) => {
          logger.error(
            `~ file: wr_response.ts:85 ~ WRResponse ~ sendFile ~ entered in on(error) function to unlinkSync ${JSON.stringify(
              error.message
            )}`
          );
          this.error(error);
          fs.unlinkSync(data.filePath!);
          logger.error(
            `~ file: wr_response.ts:92 ~ WRResponse ~ sendFile ~ entered in on(error) function to unlinkSync ${JSON.stringify(
              data.filePath
            )}`
          );
        });
      } catch (error) {
        logger.error(JSON.stringify(error));
        this.error(error);
      }
    }
  }

  public error(error: Error) {
    this.response!.status((error as RespError).code).json({ error: error.message });
  }
}
