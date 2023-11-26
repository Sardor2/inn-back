import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetUser } from 'src/auth/decorators/get-user';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @GetUser('sub') id: string,
  ) {
    return this.paymentsService.create(createPaymentDto, +id);
  }

  @Get()
  findAll(@Query() query: any, @GetUser('sub') id: string) {
    return this.paymentsService.findAll(query, +id);
  }

  @Get('/within-intervals')
  findWithinIntervals(@Query() query: any, @GetUser('sub') id: string) {
    return this.paymentsService.findPaymentsWithinInterval(query, +id);
  }

  @Get('/monthly-accounting')
  getMonthlyAccounting(@Query() query: any, @GetUser('sub') id: string) {
    return this.paymentsService.getMonthlyAccounting(query, +id);
  }
  @Get('/yearly-accounting')
  getYearlyAccounting(@Query() query: any, @GetUser('sub') id: string) {
    return this.paymentsService.getYearlyAccounting(query, +id);
  }

  @Get('/total-daily-payments')
  getTotalDailyPayments(
    @Query() query, 
    @GetUser('sub') id: string
  ) {
    return this.paymentsService.findTotalDailyPayments(query, +id)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentsService.update(+id, updatePaymentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentsService.remove(+id);
  // }
}
