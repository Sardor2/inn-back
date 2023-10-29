import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import { Public } from 'src/auth/decorators/is-public';
import { FileUploadService } from './file-upload.service';
const crypto = require('node:crypto');

export const editFileName = (_, file, callback) => {
  const fileExtName = extname(file.originalname);
  const name = crypto.randomUUID();
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('file-upload')
export class FileUploadController {
  constructor(private uploadService: FileUploadService) {}
  @Post('image')
  @Public()
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10000000,
            message: 'Max is 10mb',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadSingleV2(file);
  }

  @Public()
  @Post('image/multiple')
  @UseInterceptors(FilesInterceptor('images'))
  uploadMultipleImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10000000,
            message: 'Max is 10mb',
          }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.uploadService.uploadMultiple(files);
  }
}
