/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateBookingDto, UserGuestDto } from './dto/create-booking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomStatus } from 'src/rooms/constants';
import { BookingStatus } from './constants';
import { users } from '@prisma/client';
import { PaymentType } from 'src/reservations/constants';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import * as dayjs from 'dayjs';

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
      discount,
      tariff_plan_id,
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

    const initialPayment = +paid;

    const debt = Number(amount) - initialPayment;

    // Original total price computed as amount + discount
    // price per day comes from tariff also computed as originalprice/days

    const booking = await this.prisma.bookings.create({
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
        discount,
        tariff_plan_id: String(tariff_plan_id),
        debt: String(debt),
      },
    });

    if (initialPayment > 0) {
      await this.prisma.payment_records.create({
        data: {
          sum: initialPayment,
          pay_date: new Date().toISOString(),
          booking_id: Number(booking.id),
          pay_type,
        },
      });
    }

    return booking;
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

  async getRoomsWithBookings(hotel_id: number, query) {
    let { search } = query;
    let where = {};

    if (search) {
      where = {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            type: {
              contains: search,
            },
          },
          {
            status: {
              contains: search,
            },
          },
        ],
      };
    }
    const rooms = await this.prisma.rooms.findMany({
      where: {
        hotel_id,
        active: true,
        ...where,
      },
    });

    await Promise.all(
      rooms.map(async (room) => {
        if (room.status === RoomStatus.KEEPING) {
          // @ts-ignore
          room.booking_data = await this.findByRoomNumber(
            +room.title,
            hotel_id,
          );
        }
      }),
    );

    return {
      results: rooms,
    };
  }

  async getDailyRegistrationStats(hotel_id: number) {
    const arrivalsToday = await this.prisma
      .$queryRaw`select count(*) from bookings where date(start_date) = date(${dayjs().format(
      'YYYY-MM-DD',
    )}) and hotel_id = ${hotel_id}`;

    const departureToday = await this.prisma
      .$queryRaw`select count(*) from bookings where date(end_date) = date(${dayjs().format(
      'YYYY-MM-DD',
    )}) and hotel_id = ${hotel_id}`;

    return {
      arrivalsCount: arrivalsToday[0]['count(*)'],
      departureCount: departureToday[0]['count(*)'],
    };
  }

  async findByRoomNumber(room_number: number, hotel_id: number) {
    let booking = await this.prisma.bookings.findFirst({
      where: {
        rooms: room_number,
        status: BookingStatus.CheckedIn,
        hotel_id,
      },
    });

    if (!booking) return null;

    // @ts-ignore
    booking.user = await this.prisma.users.findUnique({
      where: {
        id: booking.user_id,
      },
    });

    // @ts-ignore
    booking.tariff_info = await this.prisma.tariff_plans.findFirst({
      where: {
        id: +booking.tariff_plan_id,
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

  async applyDiscount({ discount_amount, booking_id }: ApplyDiscountDto) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id: booking_id,
      },
    });

    return this.prisma.bookings.update({
      where: {
        id: booking_id,
      },
      data: {
        discount: Number(booking.discount) + Number(discount_amount),
      },
    });
  }

  async accountingDailyRecords(query: any) {
    let { day } = query;
    day = day || new Date();

    const results = await this.prisma.bookings.findMany({
      where: {
        end_date: day,
        status: BookingStatus.CheckedOut,
      },
    });

    return {
      results,
    };
  }

  async departureLists(hotel_id: number, query) {
    const limit = +query.limit || 10;
    const page = +query.page || 1;

    const fromDate = query.fromDate;
    const toDate = query.toDate;
    const search = query.search;

    const skip = page * limit - limit;

    let where = {
      hotel_id,
      status: BookingStatus.CheckedOut,
    };

    if (fromDate && toDate) {
      where = Object.assign(where, {
        end_date: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      });
    }

    if (search) {
      where = Object.assign(where, {
        OR: [
          {
            room_type: search,
          },
          !isNaN(search)
            ? {
                rooms: {
                  equals: +search,
                },
              }
            : {},
          {
            admin: {
              contains: search,
            },
          },
          {
            agent: {
              contains: search,
            },
          },
        ],
      });
    }

    let results = await this.prisma.bookings.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        created_at: 'desc',
      },
    });

    let count = await this.prisma.bookings.count({
      where,
    });

    await Promise.all(
      results.map(async (booking) => {
        const users = await this.getPersonsOfBooking(Number(booking.id));
        // @ts-ignore
        booking.users = users.results;
      }),
    );

    return {
      results,
      count,
    };
  }
}
