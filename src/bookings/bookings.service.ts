import { Injectable } from '@nestjs/common';
import { CreateBookingDto, UserGuestDto } from './dto/create-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomStatus } from 'src/rooms/constants';
import { BookingStatus } from './constants';
import { users } from '@prisma/client';
import { PaymentType } from 'src/reservations/constants';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    {
      admin,
      start_date,
      end_date,
      notes,
      paid,
      room_number,
      room_type,
      room_id,
      amount,
      children,
      users,
      country,
      agent,
      pay_type,
    }: CreateBookingDto,
    hotel_id: number,
  ) {
    const usersResult = await this.findOrCreateUsers(users);

    await this.prisma.rooms.update({
      where: {
        id: room_id,
      },
      data: {
        status: RoomStatus.KEEPING,
      },
    });

    return this.prisma.bookings.create({
      data: {
        start_date,
        end_date,
        admin,
        notes,
        paid,
        room_type,
        rooms: room_number,
        amount,
        children,
        hotel_id,
        country,
        user_id: Number(usersResult[0].id),
        persons: usersResult
          .slice(1, usersResult.length)
          .map((user) => user.id)
          .join(','),
        agent,
        payment_type: pay_type,
      },
    });
  }

  async findOrCreateUsers(users: Array<UserGuestDto>): Promise<users[]> {
    const transactions = users.map(async (user) => {
      const existing = await this.prisma.users.findFirst({
        where: {
          phone_number: user.phone_number,
          full_name: `${user.first_name} ${user.last_name}`,
        },
      });
      if (!existing)
        return this.prisma.users.create({
          data: {
            full_name: `${user.first_name} ${user.last_name}`,
            phone_number: `${user.phone_number}`,
          },
        });
      return existing;
    });

    const results = await Promise.allSettled(transactions);

    // @ts-ignore
    return results.filter((r) => r.status === 'fulfilled').map((r) => r?.value);
  }

  async findAll(hotel_id: string, query) {
    let { status } = query;
    let where = {};

    if (status) {
      where = { ...where, status };
    }

    let bookings: any = await this.prisma.bookings.findMany({
      where: {
        hotel_id: +hotel_id,
        ...where,
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

  async getRoomsWithBookings(hotel_id: number) {
    const rooms = await this.prisma.rooms.findMany({
      where: {
        hotel_id,
        active: true,
      },
    });

    await Promise.all(
      rooms.map(async (room) => {
        if (room.status === RoomStatus.KEEPING) {
          // @ts-ignore
          room.booking_data = await this.findByRoomNumber(+room.title);
        }
      }),
    );

    return {
      results: rooms,
    };
  }

  async findByRoomNumber(room_number: number) {
    let booking = await this.prisma.bookings.findFirst({
      where: {
        rooms: room_number,
        status: BookingStatus.CheckedIn,
      },
    });

    if (!booking) return null;

    // @ts-ignore
    booking.user = await this.prisma.users.findUnique({
      where: {
        id: booking.user_id,
      },
    });

    return booking;
  }

  async getPersonsOfBooking(booking_id: number) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id: booking_id,
      },
    });
    const userIds = booking.persons ? booking.persons.split(',') : [];
    if (userIds.length === 0)
      return {
        results: [],
      };
    const people = await this.prisma.users.findMany({
      where: {
        OR: userIds?.map((id) => ({
          id: Number(id),
        })),
      },
    });

    return { results: people };
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  async update(id: number, updateBookingDto: any) {
    await this.prisma.bookings.update({
      where: { id },
      data: updateBookingDto,
    });
    return {
      message: 'Updated',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }

  getPaymentTypes() {
    return {
      results: Object.values(PaymentType),
    };
  }
}
