import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
  imports: [BookingsModule],
})
export class ReservationsModule {}
