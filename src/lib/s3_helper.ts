import path from 'path';
import constants from '../common/constants';
import utility from './utility';
import { S3Client, GetObjectCommand, PutObjectCommandInput ,  ObjectCannedACL } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { logger } from '../common/logger';
import { Readable } from 'stream';

class s3Helper {
  public s3Client(): S3Client {
    const s3 = new S3Client({
      region: 'nyc3',
      endpoint: process.env.SPACES_ENDPOINT as string,
      credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
      },
    });
    return s3;
  }

  public async uploadToS3(file: any, pathToFile: string) {
    const extensionType = path.extname(pathToFile);
    const content =
      extensionType == constants.ENUMS.FILE_FORMAT.WEBP
? constants.ENUMS.MIME_TYPE.IMAGE.WEBP
        : extensionType == constants.ENUMS.FILE_FORMAT.PNG
        ? constants.ENUMS.MIME_TYPE.IMAGE.PNG
        : constants.ENUMS.MIME_TYPE.IMAGE.SVG;
    const uploadParams: PutObjectCommandInput = {
      Bucket: constants.AWS_BUCKET_NAME,
      Key: decodeURIComponent(pathToFile),
      Body: file,
      ContentType: content,
      ACL: constants.ENUMS.ACL_TYPE.PUBLIC as  ObjectCannedACL ,
    };
    const s3 = this.s3Client();
    const upload: Upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    // start upload
    const metaData = await upload.done();
    return metaData['Location'];
  }

  public async getS3File(url: string, folder: string): Promise<any> {
    try {
      const decodedUrl = decodeURIComponent(url);
      const filename = decodedUrl.split('/').slice(3).join('/');
      logger.info(`~ file: s3_helper.ts:69 ~ s3Helper ~ getS3File ~ getS3File_${filename}`);
      
      const s3 = this.s3Client();
      let keyName = filename;
  
      if (!utility.isEmpty(folder)) {
        keyName = `${filename}`;
      }
  
      const bucketParams = {
        Bucket: constants.AWS_BUCKET_NAME,
        Key: keyName,
      };
  
      const getObject = await s3.send(new GetObjectCommand(bucketParams));
      const bufferChunks: Uint8Array[] = [];
  
      for await (const chunk of getObject.Body as Readable) {
        if (chunk instanceof Uint8Array) {
          bufferChunks.push(chunk);
        }
      }
  
      const fileBuffer = Buffer.concat(bufferChunks);
      const fileExtension = path.extname(filename);
      const fileNameWithoutExtension = path.basename(filename, fileExtension);
  
      return {
        filename: fileNameWithoutExtension,
        buffer: fileBuffer,
      };
    } catch (err) {
      logger.error(JSON.stringify(err));
      return err;
    }
  }

}

export default new s3Helper();
