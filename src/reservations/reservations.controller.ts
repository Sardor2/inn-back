import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { GetUser } from 'src/auth/decorators/get-user';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @GetUser('sub') id: string,
  ) {
    return this.reservationsService.create(createReservationDto, +id);
  }

  @Get()
  findAll(@GetUser('sub') hotelId: string, @Query() query: any) {
    return this.reservationsService.findAll(+hotelId, query);
  }

  @Get('agents-search')
  agentSearch(@Query('search') search: string) {
    return this.reservationsService.agentAutoSuggestions(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Put('cancel/:id')
  cancelReservation(@Param('id') id: string) {
    this.reservationsService.cancelReservation(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @GetUser('sub') hotel_id: string,
  ) {
    return this.reservationsService.update(
      +id,
      updateReservationDto,
      +hotel_id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
