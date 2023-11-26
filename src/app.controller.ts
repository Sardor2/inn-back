import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GetUser } from './auth/decorators/get-user';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/dashboard-analytics')
  getDashboardAnalytics(@GetUser('sub') id: string) {
    return this.appService.getDashboardAnalyticsData(+id);
  }

  @Get('/currencies')
  getCurrencies() {
    return this.appService.getCurrency();
  }
}
