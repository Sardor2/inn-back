import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { RegionsModule } from './regions/regions.module';
import { ComfortablesModule } from './comfortables/comfortables.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), HotelsModule, RegionsModule, ComfortablesModule, FileUploadModule, RoomsModule, ReservationsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
