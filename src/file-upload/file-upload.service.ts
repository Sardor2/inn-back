import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
const FormData = require('form-data');

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;
  private BUCKET: string;
  private s3Region: string;

  constructor(private config: ConfigService) {
    this.s3Client = new S3Client({ region: config.get('AWS_S3REGION') });
    this.BUCKET = this.config.get('AWS_S3BUCKET_NAME');
    this.s3Region = this.config.get('AWS_S3REGION');
  }

  async uploadSingle(file: Express.Multer.File) {
    const fd = new FormData();

    fd.append('image', Buffer.from(file.buffer), file.originalname);

    try {
      const res = await axios
        .post(this.config.get('IMGUR_API') + '/3/image', fd, {
          headers: {
            Authorization: `Client-ID ${this.config.get('IMGUR_CLIENT_ID')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => res.data);

      return {
        url: res?.data?.link,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload');
    }
  }

  async uploadSingleV2(file: Express.Multer.File) {
    const newName = uuidV4();

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.BUCKET,
        Key: newName,
        Body: file.buffer,
      }),
    );

    return {
      url: `https://${this.BUCKET}.s3.${this.s3Region}.amazonaws.com/${newName}`,
    };
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    return await Promise.all(files.map(this.uploadSingleV2.bind(this)));
  }
}
