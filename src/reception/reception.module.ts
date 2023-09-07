import { Module } from '@nestjs/common';
import { ReceptionService } from './reception.service';
import { ReceptionController } from './reception.controller';

@Module({
  controllers: [ReceptionController],
  providers: [ReceptionService]
})
export class ReceptionModule {}
