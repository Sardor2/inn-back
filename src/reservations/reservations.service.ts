import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingsService } from 'src/bookings/bookings.service';
import { PaymentStatus } from './constants';
import { ErrorTypes } from 'src/global-constants';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private bookingService: BookingsService,
  ) {}

  private dateRangesOverlap(i1: [string, string], i2: [string, string]) {
    const range1Start = new Date(i1[0]);
    const range1End = new Date(i1[1]);

    const range2Start = new Date(i2[0]);
    const range2End = new Date(i2[1]);

    const maxStart = new Date(
      Math.max(range1Start.getTime(), range2Start.getTime()),
    );

    const minEnd = new Date(Math.min(range1End.getTime(), range2End.getTime()));

    return maxStart <= minEnd;
  }

  async create(
    {
      amount,
      extra_information,
      children,
      country,
      end_date,
      paid: has_been_paid,
      agent,
      pay_type,
      room_id,
      room_type,
      start_date,
      first_name,
      last_name,
      phone_number,
    }: CreateReservationDto,
    hotel_id: number,
  ) {
    const [user] = await this.bookingService.findOrCreateUsers([
      { first_name, last_name, phone_number },
    ]);

    if (new Date(start_date) < new Date()) {
      throw new BadRequestException('PAST_DATE');
    }

    const reservations = await this.prisma.reservations.findMany({
      where: {
        rooms: String(room_id),
        hotel_id,
        done: 0,
        NOT: [
          {
            start_date: null,
          },
          {
            start_date: undefined,
          },
          {
            end_date: null,
          },
          {
            end_date: undefined,
          },
        ],
      },
    });

    let overlaps = false;
    try {
      for (let i = 0; i < reservations.length; i++) {
        const r = reservations[i];
        if (r.start_date && r.end_date) {
          if (
            this.dateRangesOverlap(
              [start_date, end_date],
              [r.start_date?.toISOString(), r.end_date?.toISOString()],
            )
          ) {
            overlaps = true;
            break;
          }
        }
      }
    } catch (e) {}

    if (overlaps) {
      throw new BadRequestException(ErrorTypes.INTERVAL_OVERLAP);
    }

    await this.prisma.reservations.create({
      data: {
        amount,
        start_date,
        end_date,
        hotel_id,
        user_id: Number(user.id),
        rooms: String(room_id),
        room_type,
        pay_type,
        status: has_been_paid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        children,
        done: 0,
        notes: extra_information,
        country,
        agent,
      },
    });

    return {
      message: 'Created!',
    };
  }

  async findAll(hotel_id: number, query) {
    const limit = +query.limit || 10;
    const page = +query.page || 1;

    const skip = page * limit - limit;

    let {
      room_types,
      pay_type,
      payment_status,
      created_at_sort = 'desc',
    } = query;
    let whereQuery = {
      hotel_id,
    };

    if (room_types) {
      room_types = JSON.parse(room_types);
      whereQuery = {
        ...whereQuery,
        // @ts-ignore
        OR: room_types
          ? room_types?.map((room_type) => ({
              room_type,
            }))
          : undefined,
      };
    }

    if (pay_type) whereQuery = Object.assign(whereQuery, { pay_type });
    if (payment_status)
      whereQuery = Object.assign(whereQuery, { status: payment_status });

    let [reservations, count] = await Promise.all([
      this.prisma.reservations.findMany({
        where: {
          ...whereQuery,
          done: 0,
        },
        orderBy: {
          // amount: {
          //   sort: amount_sort,
          // },
          created_at: {
            sort: created_at_sort,
          },
        },
        take: limit,
        skip,
      }),
      this.prisma.reservations.count({
        where: whereQuery,
      }),
    ]);

    let reservationsWithUsers = await Promise.all(
      reservations.map(async (r) => {
        const user = await this.prisma.users.findUnique({
          where: {
            id: r.user_id,
          },
        });
        // @ts-ignore
        r.user = user;
        return r;
      }),
    );

    return {
      results: reservationsWithUsers,
      count,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  async update(id: number, dto: UpdateReservationDto, hotel_id: number) {
    let {
      end_date,
      start_date,
      room_id,
      user,
      extra_information,
      country,
      paid,
      ...reservationUpdateObj
    } = dto;

    const roomReservations = await this.prisma.reservations.findMany({
      where: {
        rooms: String(room_id),
        done: 0,
        hotel_id,
        NOT: [
          {
            start_date: null,
          },
          {
            start_date: undefined,
          },
          {
            end_date: null,
          },
          {
            end_date: undefined,
          },
          {
            id,
          },
        ],
      },
    });

    let overlaps = false;
    for (let i = 0; i < roomReservations.length; i++) {
      const r = roomReservations[i];
      if (r.start_date && r.end_date && start_date && end_date) {
        if (
          this.dateRangesOverlap(
            [start_date, end_date],
            [r.start_date?.toISOString(), r.end_date?.toISOString()],
          )
        ) {
          overlaps = true;
          break;
        }
      }
    }
    if (overlaps) {
      throw new BadRequestException(ErrorTypes.INTERVAL_OVERLAP);
    }

    if (user) {
      const { id, first_name, last_name, phone_number } = user;
      await this.prisma.users.update({
        where: {
          id,
        },
        data: {
          full_name: `${first_name} ${last_name}`,
          phone_number,
        },
      });
    }

    if (start_date && end_date) {
      reservationUpdateObj = Object.assign(reservationUpdateObj, {
        start_date,
        end_date,
      });
    }

    if (room_id) {
      reservationUpdateObj = Object.assign(reservationUpdateObj, {
        rooms: String(room_id),
      });
    }

    return this.prisma.reservations.update({
      where: {
        id,
      },
      data: {
        ...reservationUpdateObj,
        country,
        status: paid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        notes: extra_information,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
