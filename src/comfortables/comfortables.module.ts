import { Module } from '@nestjs/common';
import { ComfortablesService } from './comfortables.service';
import { ComfortablesController } from './comfortables.controller';

@Module({
  controllers: [ComfortablesController],
  providers: [ComfortablesService]
})
export class ComfortablesModule {}
