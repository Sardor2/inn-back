import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id: dto.booking_id,
      },
    });

    if (!booking) {
      throw new BadRequestException('Invalid booking id');
    }

    const updatedDebt = Number(booking.debt) - Number(dto.sum);
    const updatedTotalPaidAmount = Number(booking.paid) + Number(dto.sum);

    if (updatedDebt < 0) {
      throw new BadRequestException("Debt can't be negative!");
    }

    if (updatedTotalPaidAmount > +booking.amount) {
      throw new BadRequestException("Can't pay more than total required!");
    }

    await this.prisma.bookings.update({
      where: {
        id: dto.booking_id,
      },
      data: {
        debt: String(updatedDebt),
        paid: String(updatedTotalPaidAmount),
      },
    });

    return this.prisma.payment_records.create({
      data: {
        ...dto,
        pay_date: new Date().toISOString(),
      },
    });
  }

  async findAll({
    pay_date = dayjs(new Date()).format('YYYY-MM-DD'),
    limit = 10,
    page = 1,
  }: any) {
    const skip = limit * page - limit;

    // let records = await this.prisma.payment_records.findMany({
    //   skip,
    //   take: limit,
    //   where: {
    //     pay_date: {
    //       gte: new Date(pay_date),
    //       lte: new Date(pay_date),
    //     },
    //   },
    // });

    let records: Array<any> = await this.prisma
      .$queryRaw`select * from payment_records where date(pay_date) = date(${pay_date}) limit ${limit} OFFSET ${skip}`;

    let countQueryResult = await this.prisma
      .$queryRaw`select count(*) from payment_records where date(pay_date) = date(${pay_date})`;

    await Promise.all(
      records.map(async (r) => {
        // @ts-ignore
        r.booking_data = await this.prisma.bookings.findUnique({
          where: {
            id: r.booking_id,
          },
        });
      }),
    );

    return {
      results: records,
      count: Number(countQueryResult[0]['count(*)']),
    };
  }

  async findActiveDebts() {
    // return this.prisma.$executeRaw()
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
