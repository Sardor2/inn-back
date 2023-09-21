import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetUser } from 'src/auth/decorators/get-user';
import { ApplyDiscountDto } from './dto/apply-discount.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @GetUser('sub') id: string,
  ) {
    return this.bookingsService.create(createBookingDto, +id);
  }

  @Get()
  findAll(@GetUser('sub') hotelId: string, @Query() query) {
    return this.bookingsService.findAll(hotelId, query);
  }

  @Get('rooms')
  getRoomsWithBookings(@GetUser('sub') id: string, @Query() query: any) {
    return this.bookingsService.getRoomsWithBookings(+id, query);
  }

  @Get('payment-types')
  getPaymentTypes() {
    return this.bookingsService.getPaymentTypes();
  }

  @Get('/accounting/daily')
  accountingDaily(@Query() query: any) {
    return this.bookingsService.accountingDailyRecords(query);
  }

  @Get(':id/persons')
  getPersonsOfBooking(@Param('id') id: string) {
    return this.bookingsService.getPersonsOfBooking(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Post('apply-discount')
  applyDiscount(@Body() dto: ApplyDiscountDto) {
    return this.bookingsService.applyDiscount(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
