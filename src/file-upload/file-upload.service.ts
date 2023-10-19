import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
const FormData = require('form-data');

@Injectable()
export class FileUploadService {
  constructor(private config: ConfigService) {}

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
      throw new InternalServerErrorException(error);
    }
  }

  async uploadMultiple(files: Express.Multer.File[]) {
    return await Promise.all(files.map(this.uploadSingle.bind(this)));
  }
}
