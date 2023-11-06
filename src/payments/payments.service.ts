import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { isNil } from 'lodash';
import { PaymentType } from 'src/reservations/constants';
import { payment_records } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, hotel_id: number) {
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
        hotel_id,
      },
    });
  }

  async findAll(
    {
      pay_date = dayjs(new Date()).format('YYYY-MM-DD'),
      limit = 10,
      page = 1,
    }: any,
    hotel_id: number,
  ) {
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
      .$queryRaw`select * from payment_records where date(pay_date) = date(${pay_date}) and hotel_id=${hotel_id} limit ${limit} OFFSET ${skip}`;

    let countQueryResult = await this.prisma
      .$queryRaw`select count(*) from payment_records where date(pay_date) = date(${pay_date}) and hotel_id=${hotel_id}`;

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

  async findPaymentsWithinInterval(query: any, hotel_id: number) {
    const { fromDate, toDate, limit = 10, page = 1 } = query;
    const skip = limit * page - limit;

    const records: any[] = await this.prisma.$queryRaw`
      select * from payment_records where date(pay_date) >= date(${fromDate}) and 
      date(pay_date) <= date(${toDate}) and 
      hotel_id=${hotel_id}
      limit ${limit}
      offset ${skip}
    `;

    const count = await this.prisma.$queryRaw`
        select count(*) from payment_records where date(pay_date) >= date(${fromDate}) and 
        date(pay_date) <= date(${toDate}) and 
        hotel_id=${hotel_id}
    `;

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
      count: Number(count[0]['count(*)']),
    };
  }

  async getMonthlyAccounting(query, hotel_id: number) {
    let date = query.date || new Date();

    const month = dayjs(date).month() + 1;
    const year = dayjs(date).year();

    const totals = {
      [PaymentType.card]: 0,
      [PaymentType.cash]: 0,
      [PaymentType.transfer]: 0,
      total: 0,
    };

    const results: payment_records[] = await this.prisma.$queryRaw`
      select pay_type, sum(sum) as sum from payment_records where 
      month(pay_date) = ${month} and
      year(pay_date) = ${year} and
      hotel_id=${hotel_id}
      group by pay_type
    `;

    for (let i = 0; i < results?.length; i++) {
      const record = results[i];
      totals[record.pay_type] = +record.sum;
      totals.total += Number(record.sum);
    }

    return {
      calc: totals,
    };
  }

  async getYearlyAccounting(query, hotel_id: number) {
    let date = query.date || new Date();

    const year = dayjs(date).year();

    const totals = {
      [PaymentType.card]: 0,
      [PaymentType.cash]: 0,
      [PaymentType.transfer]: 0,
      total: 0,
    };

    const results: any = await this.prisma.$queryRaw`
      select  pay_type, sum(sum) as sum from payment_records where
      year(pay_date) = ${year} and 
      hotel_id = ${hotel_id}
      group by pay_type;
  `;

    for (let i = 0; i < results?.length; i++) {
      const record = results[i];
      totals[record.pay_type] = +record.sum;
      totals.total += Number(record.sum);
    }

    return {
      calc: totals,
    };
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
