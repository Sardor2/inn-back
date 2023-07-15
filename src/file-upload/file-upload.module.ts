import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [FileUploadController],
  imports: [
    MulterModule.register({
      dest: './files',
    }),
  ],
})
export class FileUploadModule {}
