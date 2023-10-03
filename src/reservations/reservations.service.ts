import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingsService } from 'src/bookings/bookings.service';
import { PaymentStatus } from './constants';
import { ErrorTypes } from 'src/global-constants';
import * as dayjs from 'dayjs';
import { BookingStatus } from 'src/bookings/constants';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class ReservationsService {
  constructor(
    private prisma: PrismaService,
    private bookingService: BookingsService,
    private utils: UtilsService,
  ) {}

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
      room_number,
    }: CreateReservationDto,
    hotel_id: number,
  ) {
    const [user] = await this.bookingService.findOrCreateUsers([
      { first_name, last_name, phone_number },
    ]);

    if (dayjs(start_date).isBefore(new Date(), 'days')) {
      throw new BadRequestException('PAST_DATE');
    }

    const reservations = await this.prisma.reservations.findMany({
      where: {
        rooms: String(room_id),
        hotel_id,
        OR: [
          {
            done: 0,
          },
          {
            done: null,
          },
        ],
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

    const bookings = await this.prisma.bookings.findMany({
      where: {
        rooms: +room_number,
        status: BookingStatus.CheckedIn,
      },
    });

    const reservationsAndBookings = [...bookings, ...reservations];

    let overlaps = false;
    try {
      for (let i = 0; i < reservationsAndBookings.length; i++) {
        const r = reservationsAndBookings[i];
        if (r.start_date && r.end_date) {
          if (
            this.utils.dateRangesOverlap(
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
    // const limit = +query.limit || 10;
    // const page = +query.page || 1;

    // const skip = page * limit - limit;

    let {
      room_types,
      pay_type,
      payment_status,
      // created_at_sort = 'desc',
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
          start_date: {
            gte: dayjs()
              .subtract(3, 'days')
              .set('hour', 0)
              .set('minute', 0)
              .set('second', 0)
              .toISOString(),
          },
          OR: [
            {
              done: 0,
            },
            {
              done: null,
            },
          ],
        },
        // orderBy: {
        //   // amount: {
        //   //   sort: amount_sort,
        //   // },
        //   // created_at: {
        //   //   sort: created_at_sort,
        //   // },
        // },
        // take: limit,
        // skip,
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

  async agentAutoSuggestions(search: string) {
    if (!search) {
      return {
        results: [],
      };
    }
    const [reservationAgents, bookingAgents] = await this.prisma.$transaction([
      this.prisma.reservations.findMany({
        where: {
          agent: {
            contains: search,
          },
        },
        select: {
          agent: true,
        },
      }),
      this.prisma.bookings.findMany({
        where: {
          agent: {
            contains: search,
          },
        },
        select: {
          agent: true,
        },
      }),
    ]);

    return {
      results: reservationAgents.concat(bookingAgents).map((a) => a.agent),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  async cancelReservation(id: number) {
    await this.prisma.reservations.update({
      where: {
        id,
      },
      data: {
        done: 1,
      },
    });

    return {
      message: 'Canceled!',
    };
  }

  async update(id: number, dto: UpdateReservationDto, hotel_id: number) {
    let {
      end_date,
      start_date,
      room_id,
      room_number,
      user,
      extra_information,
      country,
      paid,
      agent,
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

    const roomBookings = await this.prisma.bookings.findMany({
      where: {
        rooms: +room_number,
        status: BookingStatus.CheckedIn,
      },
    });

    const roomActiveBookingsAndReservations = [
      ...roomBookings,
      ...roomReservations,
    ];

    let overlaps = false;

    for (let i = 0; i < roomActiveBookingsAndReservations.length; i++) {
      const r = roomActiveBookingsAndReservations[i];
      if (r.start_date && r.end_date && start_date && end_date) {
        if (
          this.utils.dateRangesOverlap(
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
        end_date: dayjs(end_date)
          .set('hour', 22)
          .set('minute', 59)
          .set('second', 60)
          .toISOString(),
      });
    }

    if (agent) {
      reservationUpdateObj = Object.assign(reservationUpdateObj, {
        agent,
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
