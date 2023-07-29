import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  create(createReservationDto: CreateReservationDto) {
    return 'This action adds a new reservation';
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

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
