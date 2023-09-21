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

    if (updatedDebt < 0) {
      throw new BadRequestException("Debt can't be negative!");
    }

    await this.prisma.bookings.update({
      where: {
        id: dto.booking_id,
      },
      data: {
        debt: String(updatedDebt),
      },
    });

    return this.prisma.payment_records.create({
      data: {
        ...dto,
        pay_date: new Date().toISOString(),
      },
    });
  }

  async findAll({ pay_date }: any) {
    pay_date = pay_date || new Date();

    let records = await this.prisma.payment_records.findMany();

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
      results: records.filter((r) => dayjs(pay_date).isSame(r.pay_date, 'day')),
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
