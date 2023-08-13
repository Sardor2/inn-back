import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  async findAll(hotel_id: string) {
    let bookings: any = await this.prisma.bookings.findMany({
      where: {
        hotel_id: +hotel_id,
      },
    });

    bookings = await Promise.all(
      bookings.map(async (b: any) => {
        let user = null,
          room = null;
        try {
          user = await this.prisma.users.findUnique({
            where: {
              id: b.user_id,
            },
          });
          room = await this.prisma.rooms.findUnique({
            where: {
              id: b.rooms,
            },
          });
        } catch (error) {}

        b.user = user;
        b.room = room;
        return b;
      }),
    );

    return {
      results: bookings,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  async update(id: number, updateBookingDto: any) {
    await this.prisma.bookings.update({
      where: { id },
      data: updateBookingDto,
    });
    return 'Updated';
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
