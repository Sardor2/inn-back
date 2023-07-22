import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [FileUploadController],
  imports: [HttpModule],
  providers: [FileUploadService],
})
export class FileUploadModule {}
