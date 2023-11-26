import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PaymentType } from './reservations/constants';
import * as dayjs from 'dayjs';
import { BookingsService } from './bookings/bookings.service';
import { RoomStatus } from './rooms/constants';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private bookingService: BookingsService,
    private httpService: HttpService,
  ) {}

  private async findTotalDailyPayments(hotel_id: number) {
    const date = dayjs(new Date());

    const totals = {
      [PaymentType.card]: 0,
      [PaymentType.cash]: 0,
      [PaymentType.transfer]: 0,
      total: 0,
    };

    const results: any = await this.prisma.$queryRaw`
      select pay_type, sum(sum) as sum from payment_records where
      date(pay_date) = ${date.format('YYYY-MM-DD')} and 
      hotel_id = ${hotel_id}
      group by pay_type;
    `;

    for (let i = 0; i < results?.length; i++) {
      const record = results[i];
      totals[record.pay_type] = +record.sum;
      totals.total += Number(record.sum);
    }

    return {
      results: totals,
    };
  }

  async getCurrency() {
    const res = await this.httpService.axiosRef
      .get('https://cbu.uz/uz/arkhiv-kursov-valyut/json')
      .then((res) => res.data);

    return res;
  }

  async getDashboardAnalyticsData(hotel_id: number) {
    const { arrivalsCount, departureCount } =
      await this.bookingService.getDailyRegistrationStats(hotel_id);
    const checkedInToday = await this.prisma.bookings.count({
      where: {
        start_date: new Date(),
      },
    });

    const paymentsMadeToday = await this.findTotalDailyPayments(hotel_id);

    const availableRoomsCount = await this.prisma.rooms.count({
      where: {
        status: RoomStatus.AVAILABLE,
      },
    });

    const totalRoomsCount = await this.prisma.rooms.count();

    return {
      paymentsMadeToday,
      arrivalsCount,
      departureCount,
      checkedInToday,
      occupancyOfRoomsPercent: Math.round(
        (availableRoomsCount / totalRoomsCount) * 100,
      ),
    };
  }
}
